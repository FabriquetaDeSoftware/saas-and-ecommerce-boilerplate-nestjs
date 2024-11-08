import { Inject, Injectable } from '@nestjs/common';
import { SignInAuthDto } from '@src/auth/dto/sign_in_auth.dto';
import { Auth } from '@src/auth/entities/auth.entity';
import { ISignInUseCase } from '@src/auth/interfaces/use_cases/sign_in.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateTokenUtil } from '@src/shared/utils/interfaces/generate_token.util.interface';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

@Injectable()
export class SignInUseCase implements ISignInUseCase {
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateTokenUtil')
  private readonly generateTokenUtil: IGenerateTokenUtil;

  public async execute(input: SignInAuthDto): Promise<ITokensReturns> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<ITokensReturns> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this.generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
      });

    return { access_token, refresh_token };
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this.findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      return null;
    }

    return findUserByEmail;
  }
}
