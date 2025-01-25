import { ITokensReturnsHelper } from '../helpers/tokens_returns.helper.interface';
import { SignInDto } from 'src/modules/auth/application/dto/sign_in.dto';

export interface ISignInDefaultUseCase {
  execute(input: SignInDto): Promise<ITokensReturnsHelper>;
}
