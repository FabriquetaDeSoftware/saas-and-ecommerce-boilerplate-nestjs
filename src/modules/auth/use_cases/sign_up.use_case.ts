import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/sign_up.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { EmailSenderDto } from 'src/shared/modules/email/dto/email_sender.dto';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/enum/template.enum';
import { ISignUpUseCase } from '../interfaces/use_cases/sign_up.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';

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

  @Inject('IGenerateCodeOfVerificationUtil')
  private readonly _generateCodeOfVerificationUtil: IGenericExecute<
    void,
    string
  >;

  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: IGenericExecute<
    EmailSenderDto,
    { message: string }
  >;

  public async execute(input: SignUpDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpDto): Promise<Auth> {
    const [, hashedPassword, verificationCodeAndExpiresDate] =
      await Promise.all([
        this.checkEmailExistsAndError(data.email),
        this.hashPassword(data.password),
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

    await this.emailSender({
      emailTo: result.email,
      language: LanguageEnum.PT_BR,
      subject: 'sujeito',
      template: TemplateEnum.ACCOUNT_VERIFICATION,
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

  private async emailSender(data: EmailSenderDto): Promise<void> {
    await this._sendEmailQueueJob.execute({
      emailTo: data.emailTo,
      language: data.language,
      subject: data.subject,
      template: data.template,
    });
  }

  private async checkEmailExistsAndError(email: string): Promise<void> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (findUserByEmail) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await this._hashUtil.generateHash(password);
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
