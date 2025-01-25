import { ITokensReturnsHelper } from './tokens_returns.helper.interface';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';

export interface IGenerateTokenHelper {
  execute(input: GenerateTokenDto): Promise<ITokensReturnsHelper>;
}
