import { RefreshTokenAuthDto } from '@src/auth/dto/refresh_token_auth.dto';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

export interface IRefreshTokenService {
  execute(input: RefreshTokenAuthDto): Promise<ITokensReturns>;
}
