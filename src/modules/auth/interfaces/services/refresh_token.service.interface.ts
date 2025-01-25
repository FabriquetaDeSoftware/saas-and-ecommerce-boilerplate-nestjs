import { ITokensReturns } from 'src/modules/auth/interfaces/helpers/tokens_returns.interface';
import { RefreshTokenDto } from '../../dto/refresh_token.dto';

export interface IRefreshTokenService {
  execute(input: RefreshTokenDto): Promise<ITokensReturns>;
}
