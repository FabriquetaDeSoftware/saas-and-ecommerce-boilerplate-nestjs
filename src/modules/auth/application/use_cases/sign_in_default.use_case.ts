import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDefaultDto } from '../dto/sign_in_default.dto';
import { ISignInDefaultUseCase } from '../../domain/interfaces/use_cases/sign_in_default.use_case.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateTokenHelper } from '../../domain/interfaces/helpers/generate_token.helper.interface';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { User } from 'src/shared/entities/user.entity';

@Injectable()
export class SignInDefaultUseCase implements ISignInDefaultUseCase {
  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  public async execute(input: SignInDefaultDto): Promise<ITokensReturnsHelper> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<ITokensReturnsHelper> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

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
}
