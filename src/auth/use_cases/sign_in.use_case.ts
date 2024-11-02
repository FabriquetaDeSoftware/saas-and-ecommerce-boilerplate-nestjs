import { Inject, Injectable } from '@nestjs/common';
import { SignInAuthDto } from '@auth/dto/ sign_in_auth.dto';
import { Auth } from '@auth/entities/auth.entity';
import { IGenericExecutable } from '@src/shared/interfaces/generic_executable.interface';

@Injectable()
export class SignInUseCase implements IGenericExecutable<SignInAuthDto, Auth> {
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IGenericExecutable<
    string,
    Auth | void
  >;

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
