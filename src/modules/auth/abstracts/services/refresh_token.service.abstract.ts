import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { Auth } from '../../entities/auth.entity';
import { GenerateTokenDto } from 'src/shared/utils/dto/generate_token.dto';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

export class RefreshTokenServiceAbstract {
  @Inject()
  protected readonly _jwtService: JwtService;

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

  @Inject('ICryptoUtil')
  protected readonly _cryptoUtil: ICryptoUtil;
}
