import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

export interface IRefreshTokenService {
  execute(input: string): Promise<ITokensReturns>;
}
