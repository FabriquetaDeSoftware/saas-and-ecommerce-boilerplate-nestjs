import { Inject, Injectable } from '@nestjs/common';
import { SignInWithCredentialsAuthDto } from '../dto/sign_in_auth.dto';
import { Auth } from '../entities/auth.entity';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';
import { IHashUtil } from '@src/shared/utils/interfaces/hash.util.interface';
import { IValidateUserService } from '../interfaces/services/validate_user.service.interface';

@Injectable()
export class ValidateUserService implements IValidateUserService {
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IHashUtil')
  private readonly hashUtil: IHashUtil;

  public async execute(input: SignInWithCredentialsAuthDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(
    data: SignInWithCredentialsAuthDto,
  ): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmailAndValidate(data.email);

    await this.decryptAndValidatePassword(
      data.password,
      findUserByEmail.password,
    );

    return { ...findUserByEmail, password: undefined };
  }

  private async findUserByEmailAndValidate(email: string): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      return null;
    }

    return findUserByEmail;
  }

  private async decryptAndValidatePassword(
    password: string,
    encrypted: string,
  ): Promise<boolean> {
    const isMatch = await this.hashUtil.compareHash(password, encrypted);

    if (!isMatch) {
      return null;
    }

    return isMatch;
  }
}
