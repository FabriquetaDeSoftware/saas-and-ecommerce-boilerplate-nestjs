import { Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign_in.dto';
import { Auth } from '../entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

@Injectable()
export class ValidateUserService implements IGenericExecute<SignInDto, Auth> {
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IHashUtil')
  private readonly hashUtil: IHashUtil;

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
