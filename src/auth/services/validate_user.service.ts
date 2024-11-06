import { Inject, Injectable } from '@nestjs/common';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
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

  public async execute(input: SignInAuthDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignInAuthDto): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmail(data.email);
    if (!findUserByEmail) {
      return null;
    }

    const isMatch = await this.decryptPassword(
      data.password,
      findUserByEmail.password,
    );
    if (!isMatch) {
      return null;
    }

    return { ...findUserByEmail, password: undefined };
  }

  private async findUserByEmail(email: string): Promise<Auth | void> {
    const findUserEmail = await this.findUserByEmailHelper.execute(email);

    return findUserEmail;
  }

  private async decryptPassword(
    password: string,
    encrypted: string,
  ): Promise<boolean> {
    return await this.hashUtil.compareHash(password, encrypted);
  }
}
