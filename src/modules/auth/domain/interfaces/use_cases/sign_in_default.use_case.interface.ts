import { ITokensReturnsHelper } from '../helpers/tokens_returns.helper.interface';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';

export interface ISignInDefaultUseCase {
  execute(input: SignInDefaultDto): Promise<ITokensReturnsHelper>;
}
