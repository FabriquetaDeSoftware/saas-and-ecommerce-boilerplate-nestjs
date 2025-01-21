import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { VerificationCodeDto } from '../dto/verification_code.dto';
import { Auth } from '../entities/auth.entity';
import { VerificationCodes } from '../entities/verification_codes.entity';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IVerificationCodesRepository } from '../interfaces/repository/verification_codes.repository.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmailSenderDto } from 'src/shared/modules/email/dto/email.service.dto';

@Injectable()
export class VerifyAccountUseCase
  implements IGenericExecute<VerificationCodeDto, boolean>
{
  @Inject(CACHE_MANAGER)
  private readonly _cacheManager: Cache;

  @Inject('IVerificationCodesRepository')
  private readonly _verificationCodesRepository: IVerificationCodesRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: IGenericExecute<
    EmailSenderDto,
    { message: string }
  >;

  public async execute(data: VerificationCodeDto): Promise<boolean> {
    return await this.intermediary(data);
  }

  private async intermediary(data: VerificationCodeDto): Promise<boolean> {
    const user = await this.findUserByEmail(data.email);

    const verifyCodeByCache = await this.verifyCodeByCache(
      data.email,
      data.code.toString(),
    );

    if (verifyCodeByCache) {
      await this.updateAccountIsVerify(user.id, true);

      return true;
    }

    const verificationCode = await this.verifyExpiresDateOfCode(user.id);

    await this.verifyCode(data.code.toString(), verificationCode.code);

    await this.updateAccountIsVerify(user.id, true);

    return true;
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

    return isMatch;
  }

  private async updateAccountIsVerify(
    id: number,
    is_verified_account: boolean,
  ): Promise<Auth> {
    const result = await this._authRepository.updateInfoAuth({
      id,
      is_verified_account,
    });

    return result;
  }

  private async verifyCode(code: string, hashedCode: string): Promise<boolean> {
    const isMatch = await this._hashUtil.compareHash(code, hashedCode);

    if (!isMatch) {
      return null;
    }

    return isMatch;
  }

  private async findUserByEmail(email: string): Promise<Auth> {
    const user = await this._findUserByEmailHelper.execute(email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private async verifyExpiresDateOfCode(
    user_id: number,
  ): Promise<VerificationCodes> {
    const verificationCode =
      await this._verificationCodesRepository.findVerificationCodeByEmail(
        user_id,
      );

    if (new Date() > verificationCode.expires_at) {
      throw new BadRequestException('Invalid or expired code');
    }

    return verificationCode;
  }
}
