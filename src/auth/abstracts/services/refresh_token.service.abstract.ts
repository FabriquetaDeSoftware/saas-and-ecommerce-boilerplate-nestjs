import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/auth/entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { GenerateTokenUtilDto } from 'src/shared/utils/dto/generate_token_util.dto';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

export class RefreshTokenServiceAbstract {
  @Inject()
  protected readonly jwtService: JwtService;

  @Inject('IFindUserByEmailHelper')
  protected readonly _findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IGenerateTokenUtil')
  protected readonly _generateTokenUtil: IGenericExecute<
    GenerateTokenUtilDto,
    ITokensReturns
  >;

  @Inject('ICryptoUtil')
  protected readonly _cryptoUtil: ICryptoUtil;
}
