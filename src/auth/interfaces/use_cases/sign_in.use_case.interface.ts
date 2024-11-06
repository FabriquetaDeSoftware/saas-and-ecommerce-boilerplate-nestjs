import { SignInAuthDto } from '@src/auth/dto/sign_in_auth.dto';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

export interface ISignInUseCase {
  execute(input: SignInAuthDto): Promise<ITokensReturns>;
}
