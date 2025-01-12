import { Injectable } from '@nestjs/common';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
import { Auth } from '../entities/auth.entity';
import { ITokensReturns } from '../../shared/interfaces/tokens_returns.interface';
import { IGenericExecute } from '../../shared/interfaces/generic_execute.interface';
import { SignInUseCaseAbstract } from '../abstracts/use_cases/sign_in.use_case.abstract';

@Injectable()
export class SignInUseCase
  extends SignInUseCaseAbstract
  implements IGenericExecute<SignInAuthDto, ITokensReturns>
{
  public async execute(input: SignInAuthDto): Promise<ITokensReturns> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<ITokensReturns> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this.generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
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
