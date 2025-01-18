import { Inject } from '@nestjs/common';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { SignUpDto } from '../../dto/sign_up.dto';
import { Auth } from '../../entities/auth.entity';
import { SignInDto } from '../../dto/sign_in.dto';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { RefreshTokenDto } from '../../dto/refresh_token.dto';
import { VerificationCodeDto } from '../../dto/verification_code.dto';

export class AuthControllerAbstract {
  @Inject('ISignUpUseCase')
  protected readonly _signUpUseCase: IGenericExecute<SignUpDto, Auth>;

  @Inject('ISignInUseCase')
  protected readonly _signInUseCase: IGenericExecute<SignInDto, ITokensReturns>;

  @Inject('IRefreshTokenService')
  protected readonly _refreshTokenService: IGenericExecute<
    RefreshTokenDto,
    ITokensReturns
  >;

  @Inject('IVerifyAccountUseCase')
  protected readonly _verifyAccountUseCase: IGenericExecute<
    VerificationCodeDto,
    boolean
  >;
}
