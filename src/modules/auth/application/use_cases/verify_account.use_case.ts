import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VerificationCodeDto } from '../dto/verification_code.dto';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmailSenderDto } from 'src/shared/modules/email/application/dto/email_sender.dto';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/application/enum/template.enum';
import { IVerifyAccountUseCase } from '../../domain/interfaces/use_cases/verify_account.use_case.interface';
import { IVerificationCodesRepository } from '../../domain/interfaces/repositories/verification_codes.repository.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { VerificationCodes } from '../../domain/entities/verification_codes.entity';

@Injectable()
export class VerifyAccountUseCase implements IVerifyAccountUseCase {
  @Inject(CACHE_MANAGER)
  private readonly _cacheManager: Cache;

  @Inject('IVerificationCodesRepository')
  private readonly _verificationCodesRepository: IVerificationCodesRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  public async execute(
    data: VerificationCodeDto,
  ): Promise<{ message: string }> {
    return await this.intermediary(data);
  }

  private async intermediary(
    data: VerificationCodeDto,
  ): Promise<{ message: string }> {
    const user = await this.findUserByEmail(data.email);

    const verifyCodeByCache = await this.verifyCodeByCache(
      data.email,
      data.code.toString(),
    );

    if (verifyCodeByCache) {
      await this.updateAccountIsVerify(user.email, true);

      return await this.sendEmailVerificationCode({
        emailTo: user.email,
        language: LanguageEnum.PT_BR,
        subject: 'Seja Bem Vindo a Plataforma',
        template: TemplateEnum.WELCOME,
        variables: { NAME: user.email, LINK: 'https://example.com' },
      });
    }

    const verificationCode = await this.verifyExpiresDateOfCode(user.id);

    await this.verifyCode(data.code.toString(), verificationCode.code);

    await this.updateAccountIsVerify(user.email, true);

    return await this.sendEmailVerificationCode({
      emailTo: user.email,
      language: LanguageEnum.PT_BR,
      subject: 'Seja Bem Vindo a Plataforma',
      template: TemplateEnum.WELCOME,
      variables: { NAME: user.email, LINK: 'https://example.com' },
    });
  }

  private async sendEmailVerificationCode(
    data: EmailSenderDto,
  ): Promise<{ message: string }> {
    await this._sendEmailQueueJob.execute(data);

    return { message: 'User account verified' };
  }

  private async verifyCodeByCache(key: string, code: string): Promise<boolean> {
    const cachedCode = await this._cacheManager.get<string>(
      `accountVerificationCode:${key}`,
    );

    if (!cachedCode) {
      return null;
    }

    await this._cacheManager.del(`accountVerificationCode:${key}`);

    const isMatch = await this._hashUtil.compareHash(code, cachedCode);

    if (!isMatch) {
      throw new BadRequestException('Invalid or expired code');
    }

    return isMatch;
  }

  private async updateAccountIsVerify(
    email: string,
    is_verified_account: boolean,
  ): Promise<Partial<Auth>> {
    const result = await this._authRepository.updateInfoByEmailAuth(email, {
      is_verified_account,
    });

    return result;
  }

  private async verifyCode(code: string, hashedCode: string): Promise<boolean> {
    const isMatch = await this._hashUtil.compareHash(code, hashedCode);

    if (!isMatch) {
      throw new BadRequestException('Invalid or expired code');
    }

    return isMatch;
  }

  private async findUserByEmail(email: string): Promise<Partial<Auth>> {
    const user = await this._findUserByEmailHelper.execute(email);

    if (!user) {
      throw new NotFoundException('User email not found');
    }

    return user;
  }

  private async verifyExpiresDateOfCode(
    user_id: number,
  ): Promise<Partial<VerificationCodes>> {
    const verificationCode =
      await this._verificationCodesRepository.findVerificationCodeByAuthorId(
        user_id,
      );

    if (new Date() > verificationCode.expires_at) {
      throw new BadRequestException('Invalid or expired code');
    }

    return verificationCode;
  }
}
