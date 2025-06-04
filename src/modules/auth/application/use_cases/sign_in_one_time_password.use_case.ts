import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISignInOneTimePasswordUseCase } from '../../domain/interfaces/use_cases/sign_in_one_time_password.use_case.interface';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { SignInOneTimePasswordDto } from '../dto/sign_in_one_time_password.dto';
import { IGenerateTokenHelper } from '../../domain/interfaces/helpers/generate_token.helper.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { User } from 'src/shared/entities/user.entity';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { OneTimePassword } from '../../domain/entities/one_time_password.entity';
import { IOneTimePasswordRepository } from '../../domain/interfaces/repositories/one_time_password.repository.interface';

Injectable();
export class SignInOneTimePasswordUseCase
  implements ISignInOneTimePasswordUseCase
{
  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject(CACHE_MANAGER)
  private readonly _cacheManager: Cache;

  @Inject('IOneTimePasswordRepository')
  private readonly _oneTimePasswordRepository: IOneTimePasswordRepository;

  public async execute(
    input: SignInOneTimePasswordDto,
  ): Promise<ITokensReturnsHelper> {
    const result = await this.intermediary(input);

    return result;
  }

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  private async intermediary(
    data: SignInOneTimePasswordDto,
  ): Promise<ITokensReturnsHelper> {
    const findUserByEmail = await this.checkEmailExistsOrError(data.email);

    await this.validateUser(findUserByEmail);

    const verifyCodeByCache = await this.verifyCodeByCache(
      findUserByEmail.email,
      data.password.toString(),
    );

    if (verifyCodeByCache) {
      const { access_token, refresh_token } =
        await this._generateTokenUtil.execute({
          sub: findUserByEmail.public_id,
          email: findUserByEmail.email,
          role: findUserByEmail.role,
          name: findUserByEmail.name,
        });

      return { access_token, refresh_token };
    }

    const password = await this.verifyExpiresDateOfCode(findUserByEmail.id);

    await this.verifyCode(data.password.toString(), password.password);

    await this._oneTimePasswordRepository.deleteByUserId(findUserByEmail.id);

    const { access_token, refresh_token } =
      await this._generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
        name: findUserByEmail.name,
      });

    return { access_token, refresh_token };
  }

  private async checkEmailExistsOrError(email: string): Promise<Partial<User>> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return findUserByEmail;
  }

  private async verifyCodeByCache(key: string, code: string): Promise<boolean> {
    const cachedCode = await this._cacheManager.get<string>(
      `oneTimePassword:${key}`,
    );

    if (!cachedCode) {
      return null;
    }

    await this._cacheManager.del(`oneTimePassword:${key}`);

    const isMatch = await this.verifyCode(code, cachedCode);

    return isMatch;
  }

  private async verifyCode(code: string, hashedCode: string): Promise<boolean> {
    const isMatch = await this._hashUtil.compareHash(code, hashedCode);

    if (!isMatch) {
      throw new BadRequestException('Invalid or expired password');
    }

    return isMatch;
  }

  private async validateUser(data: Partial<User>): Promise<void> {
    if (!data || !data.is_verified_account) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return;
  }

  private async verifyExpiresDateOfCode(
    user_id: number,
  ): Promise<Partial<OneTimePassword>> {
    const OTP = await this._oneTimePasswordRepository.findOneByUserId(user_id);

    if (new Date() > OTP.expires_at) {
      throw new BadRequestException('Invalid or expired password');
    }

    return OTP;
  }
}
