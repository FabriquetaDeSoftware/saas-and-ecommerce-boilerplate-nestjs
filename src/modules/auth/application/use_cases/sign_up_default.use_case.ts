import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { SignUpDefaultDto } from '../dto/sign_up_default.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/application/enum/template.enum';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { ISignUpDefaultUseCase } from '../../domain/interfaces/use_cases/sign_up.use_case.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { User } from 'src/shared/entities/user.entity';

@Injectable()
export class SignUpDefaultUseCase implements ISignUpDefaultUseCase {
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

  public async execute(input: SignUpDefaultDto): Promise<Partial<User>> {
    const response = await this.intermediary(input);

    return response;
  }

  private async intermediary(data: SignUpDefaultDto): Promise<Partial<User>> {
    const [, hashedPassword, verificationCodeAndExpiresDate] =
      await Promise.all([
        this.checkEmailExistsAndError(data.email),
        this._hashUtil.generateHash(data.password),
        this.generateCodeOfVerificationAndExpiresDate(),
      ]);

    const fiveHoursInSeconds = 18_000;

    await this._cacheManager.set(
      `accountVerificationCode:${data.email}`,
      verificationCodeAndExpiresDate.hashedCode,
      fiveHoursInSeconds,
    );

    const result = await this.createAccount(
      data,
      hashedPassword,
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
    data: SignUpDefaultDto,
    hashedPassword: string,
    hashedCode: string,
    expiresDate: Date,
  ): Promise<Partial<User>> {
    const response = await this._authRepository.create(
      {
        ...data,
        password: hashedPassword,
      },
      hashedCode,
      expiresDate,
      {
        password: true,
        id: true,
      },
    );

    return response;
  }

  private async checkEmailExistsAndError(email: string): Promise<void> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (findUserByEmail) {
      throw new ConflictException('Unable to process request');
    }
  }

  private async generateCodeOfVerificationAndExpiresDate(): Promise<{
    expiresDate: Date;
    hashedCode: string;
    verificationCode: string;
  }> {
    const twentyFourHoursInMilliseconds = 86_400_000;

    const verificationCode = await this._generateCodeOfVerificationUtil.execute(
      twentyFourHoursInMilliseconds,
    );

    return { ...verificationCode, verificationCode: verificationCode.code };
  }
}
