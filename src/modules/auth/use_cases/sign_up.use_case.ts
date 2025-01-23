import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/sign_up.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/enum/template.enum';
import { ISignUpUseCase } from '../interfaces/use_cases/sign_up.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/interfaces/jobs/send_email_queue.job.interface';

@Injectable()
export class SignUpUseCase implements ISignUpUseCase {
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

  public async execute(input: SignUpDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpDto): Promise<Auth> {
    const [, hashedPassword, verificationCodeAndExpiresDate] =
      await Promise.all([
        this.checkEmailExistsAndError(data.email),
        this._hashUtil.generateHash(data.password),
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

    return { ...result, password: undefined };
  }

  private async createAccount(
    data: SignUpDto,
    hashedPassword: string,
    hashedCode: string,
    expiresDate: Date,
  ): Promise<Auth> {
    const response = await this._authRepository.create(
      {
        ...data,
        password: hashedPassword,
      },
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
