import { Inject } from '@nestjs/common';
import { Auth } from '../../entities/auth.entity';
import { SignUpAuthDto } from '../../dto/sign_up_auth.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { SignInAuthDto } from '../../dto/sign_in_auth.dto';
import { RefreshTokenAuthDto } from '../../dto/refresh_token_auth.dto';

export class AuthAbstractController {
  @Inject('ISignUpUseCase')
  protected readonly _signUpUseCase: IGenericExecute<SignUpAuthDto, Auth>;

  @Inject('ISignInUseCase')
  protected readonly _signInUseCase: IGenericExecute<
    SignInAuthDto,
    ITokensReturns
  >;

  @Inject('IRefreshTokenService')
  protected readonly _refreshTokenService: IGenericExecute<
    RefreshTokenAuthDto,
    ITokensReturns
  >;
}
