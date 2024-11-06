import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';
import { GenerateTokenUtilDto } from '../dto/generate_token_util.dto';

export interface IGenerateTokenUtil {
  execute(payload: GenerateTokenUtilDto): Promise<ITokensReturns>;
}
