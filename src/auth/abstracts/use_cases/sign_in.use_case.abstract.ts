import { Inject } from '@nestjs/common';
import { Auth } from 'src/auth/entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { GenerateTokenUtilDto } from 'src/shared/utils/dto/generate_token_util.dto';

export class SignInUseCaseAbstract {
  @Inject('IFindUserByEmailHelper')
  protected readonly findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IGenerateTokenUtil')
  protected readonly generateTokenUtil: IGenericExecute<
    GenerateTokenUtilDto,
    ITokensReturns
  >;
}
