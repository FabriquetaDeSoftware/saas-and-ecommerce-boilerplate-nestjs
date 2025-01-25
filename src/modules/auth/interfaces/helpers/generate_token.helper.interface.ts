import { ITokensReturnsHelper } from './tokens_returns.helper.interface';
import { GenerateTokenDto } from '../../dto/generate_token.dto';

export interface IGenerateTokenHelper {
  execute(input: GenerateTokenDto): Promise<ITokensReturnsHelper>;
}
