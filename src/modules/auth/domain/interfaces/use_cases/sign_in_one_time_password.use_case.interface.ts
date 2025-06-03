import { ITokensReturnsHelper } from '../helpers/tokens_returns.helper.interface';
import { SignInOneTimePasswordDto } from 'src/modules/auth/application/dto/sign_in_one_time_password.dto';

export interface ISignInOneTimePasswordUseCase {
  execute(input: SignInOneTimePasswordDto): Promise<ITokensReturnsHelper>;
}
