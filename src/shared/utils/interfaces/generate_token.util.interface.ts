import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { GenerateTokenDto } from '../dto/generate_token.dto';

export interface IGenerateTokenUtil {
  execute(input: GenerateTokenDto): Promise<ITokensReturns>;
}
