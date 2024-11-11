import { SignInWithCredentialsAuthDto } from '@src/auth/dto/sign_in_auth.dto';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

export interface ISignInWithCredentialsUseCase {
  execute(input: SignInWithCredentialsAuthDto): Promise<ITokensReturns>;
}
