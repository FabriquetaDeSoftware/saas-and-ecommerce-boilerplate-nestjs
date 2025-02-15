import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/application/enum/template.enum';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { ISignUpMagicLinkUseCase } from '../../domain/interfaces/use_cases/sign_up_magic_link.use_case.interface';
import { SignUpMagicLinkDto } from '../dto/sign_up_magic_link.dto';

@Injectable()
export class SignUpMagicLinkUseCase implements ISignUpMagicLinkUseCase {
  @Inject(CACHE_MANAGER)
  private readonly _cacheManager: Cache;

  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  @Inject('IGenerateNumberCodeUtil')
  private readonly _generateCodeOfVerificationUtil: IGenerateNumberCodeUtil;

  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  public async execute(input: SignUpMagicLinkDto): Promise<Auth> {
    const response = await this.intermediary(input);

    return { ...response, password: undefined, id: undefined };
  }

  private async intermediary(data: SignUpMagicLinkDto): Promise<Auth> {
    const [, verificationCodeAndExpiresDate] = await Promise.all([
      this.checkEmailExistsAndError(data.email),
      this.generateCodeOfVerificationAndExpiresDate(),
    ]);

    const twentyFourHoursInSeconds = 86400;

    await this._cacheManager.set(
      `accountVerificationCode:${data.email}`,
      verificationCodeAndExpiresDate.hashedCode,
      twentyFourHoursInSeconds,
    );

    const result = await this.createAccount(
      data,
      verificationCodeAndExpiresDate.hashedCode,
      verificationCodeAndExpiresDate.expiresDate,
    );

    await this._sendEmailQueueJob.execute({
      emailTo: result.email,
      language: LanguageEnum.PT_BR,
      subject: 'Código de Verificação da Plataforma',
      template: TemplateEnum.ACCOUNT_VERIFICATION,
      variables: {
        NAME: result.email,
        CODE: verificationCodeAndExpiresDate.verificationCode,
      },
    });

    return result;
  }

  private async createAccount(
    data: SignUpMagicLinkDto,
    hashedCode: string,
    expiresDate: Date,
  ): Promise<Auth> {
    const response = await this._authRepository.create(
      data,
      hashedCode,
      expiresDate,
    );

    return response;
  }

  private async checkEmailExistsAndError(email: string): Promise<void> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (findUserByEmail) {
      throw new ConflictException('Email already exists');
    }
  }

  private async generateCodeOfVerificationAndExpiresDate(): Promise<{
    expiresDate: Date;
    hashedCode: string;
    verificationCode: string;
  }> {
    const twentyFourHoursInMilliseconds = 86400000;
    const expiresDate = new Date(
      new Date().getTime() + twentyFourHoursInMilliseconds,
    );

    const verificationCode =
      await this._generateCodeOfVerificationUtil.execute();

    const hashedCode = await this._hashUtil.generateHash(verificationCode);

    return { expiresDate, hashedCode, verificationCode };
  }
}
