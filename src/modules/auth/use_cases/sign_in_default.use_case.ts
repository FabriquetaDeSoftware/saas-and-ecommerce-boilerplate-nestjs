import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../dto/sign_in.dto';
import { Auth } from '../entities/auth.entity';
import { ITokensReturnsHelper } from '../interfaces/helpers/tokens_returns.helper.interface';
import { ISignInDefaultUseCase } from '../interfaces/use_cases/sign_in.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateTokenHelper } from 'src/modules/auth/interfaces/helpers/generate_token.helper.interface';

@Injectable()
export class SignInDefaultUseCase implements ISignInDefaultUseCase {
  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  public async execute(input: SignInDto): Promise<ITokensReturnsHelper> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<ITokensReturnsHelper> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this._generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
      });

    return { access_token, refresh_token };
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return findUserByEmail;
  }
}
