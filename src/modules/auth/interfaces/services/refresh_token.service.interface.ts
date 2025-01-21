import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { RefreshTokenDto } from '../../dto/refresh_token.dto';

export interface IRefreshTokenService {
  execute(input: RefreshTokenDto): Promise<ITokensReturns>;
}
