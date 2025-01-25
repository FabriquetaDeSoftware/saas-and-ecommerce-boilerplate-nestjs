import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { SignInDto } from '../../dto/sign_in.dto';

export interface ISignInDefaultUseCase {
  execute(input: SignInDto): Promise<ITokensReturns>;
}
