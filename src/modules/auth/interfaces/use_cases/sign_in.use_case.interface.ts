import { ITokensReturns } from 'src/modules/auth/interfaces/helpers/tokens_returns.interface';
import { SignInDto } from '../../dto/sign_in.dto';

export interface ISignInDefaultUseCase {
  execute(input: SignInDto): Promise<ITokensReturns>;
}
