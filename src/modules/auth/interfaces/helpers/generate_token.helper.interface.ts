import { ITokensReturns } from './tokens_returns.interface';
import { GenerateTokenDto } from '../../helpers/dto/generate_token.dto';

export interface IGenerateTokenHelper {
  execute(input: GenerateTokenDto): Promise<ITokensReturns>;
}
