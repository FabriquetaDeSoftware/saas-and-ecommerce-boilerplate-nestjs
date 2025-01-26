import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IValidateUserService } from '../../domain/interfaces/services/validate_user.service.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { SignInDto } from '../../application/dto/sign_in.dto';

@Injectable()
export class ValidateUserService implements IValidateUserService {
  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  public async execute(input: SignInDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignInDto): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmailAndValidate(data.email);

    await this.decryptAndValidatePassword(
      data.password,
      findUserByEmail.password,
    );

    return { ...findUserByEmail, password: undefined };
  }

  private async findUserByEmailAndValidate(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return findUserByEmail;
  }

  private async decryptAndValidatePassword(
    password: string,
    encrypted: string,
  ): Promise<boolean> {
    const isMatch = await this._hashUtil.compareHash(password, encrypted);

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return isMatch;
  }
}
