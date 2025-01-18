import { Inject } from '@nestjs/common';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { GenerateTokenDto } from 'src/shared/utils/dto/generate_token.dto';
import { Auth } from '../../entities/auth.entity';

export class SignInUseCaseAbstract {
  @Inject('IFindUserByEmailHelper')
  protected readonly _findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IGenerateTokenUtil')
  protected readonly _generateTokenUtil: IGenericExecute<
    GenerateTokenDto,
    ITokensReturns
  >;
}
