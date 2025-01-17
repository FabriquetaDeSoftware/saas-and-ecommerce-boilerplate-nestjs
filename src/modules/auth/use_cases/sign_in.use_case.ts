import { Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dto/sign_in.dto';
import { Auth } from '../entities/auth.entity';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { GenerateTokenDto } from 'src/shared/utils/dto/generate_token.dto';

@Injectable()
export class SignInUseCase
  implements IGenericExecute<SignInDto, ITokensReturns>
{
  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IGenerateTokenUtil')
  private readonly generateTokenUtil: IGenericExecute<
    GenerateTokenDto,
    ITokensReturns
  >;

  public async execute(input: SignInDto): Promise<ITokensReturns> {
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
