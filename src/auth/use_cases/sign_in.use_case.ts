import { Inject, Injectable } from '@nestjs/common';
import { SignInAuthDto } from '@src/auth/dto/sign_in_auth.dto';
import { Auth } from '@src/auth/entities/auth.entity';
import { ISignInUseCase } from '@src/auth/interfaces/use_cases/sign_in.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';

@Injectable()
export class SignInUseCase implements ISignInUseCase {
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IFindUserByEmailHelper;

  public async execute(input: SignInAuthDto): Promise<Auth> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<Auth> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    return findUserByEmail;
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      return null;
    }

    return findUserByEmail;
  }
}
