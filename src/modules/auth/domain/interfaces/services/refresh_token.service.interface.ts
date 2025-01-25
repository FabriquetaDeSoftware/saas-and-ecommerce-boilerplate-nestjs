import { ITokensReturnsHelper } from '../helpers/tokens_returns.helper.interface';
import { RefreshTokenDto } from 'src/modules/auth/application/dto/refresh_token.dto';

export interface IRefreshTokenService {
  execute(input: RefreshTokenDto): Promise<ITokensReturnsHelper>;
}
