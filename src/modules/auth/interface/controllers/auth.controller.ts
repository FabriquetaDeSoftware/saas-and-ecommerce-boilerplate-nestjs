import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDefaultDto } from '../../application/dto/sign_up_default.dto';
import { Auth } from '../../domain/entities/auth.entity';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { SignInDefaultDto } from '../../application/dto/sign_in_default.dto';
import { LocalAuthGuard } from '../guards/local_auth.guard';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { RefreshTokenDto } from '../../application/dto/refresh_token.dto';
import { VerificationCodeDto } from '../../application/dto/verification_code.dto';
import { ISignInDefaultUseCase } from '../../domain/interfaces/use_cases/sign_in_default.use_case.interface';
import { ISignUpDefaultUseCase } from '../../domain/interfaces/use_cases/sign_up.use_case.interface';
import { IVerifyAccountUseCase } from '../../domain/interfaces/use_cases/verify_account.use_case.interface';
import { IRefreshTokenService } from '../../domain/interfaces/services/refresh_token.service.interface';
import { IForgotPasswordService } from '../../domain/interfaces/services/forgot_password.service.interface';
import { RecoveryPasswordDto } from '../../application/dto/recovery_password.dto';
import { EmailDto } from '../../application/dto/email.dto';
import { IRecoveryPasswordUseCase } from '../../domain/interfaces/use_cases/recovery_password.use_case.interface';
import { ISignInMagicLinkUseCase } from '../../domain/interfaces/use_cases/sign_in_magic_link.use_case';
import { SignUpMagicLinkDto } from '../../application/dto/sign_up_magic_link.dto';
import { ISignUpMagicLinkUseCase } from '../../domain/interfaces/use_cases/sign_up_magic_link.use_case.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpDefaultUseCase')
  private readonly _signUpDefaultUseCase: ISignUpDefaultUseCase;

  @Inject('ISignInDefaultUseCase')
  private readonly _signInDefaultUseCase: ISignInDefaultUseCase;

  @Inject('IRefreshTokenService')
  private readonly _refreshTokenService: IRefreshTokenService;

  @Inject('IVerifyAccountUseCase')
  private readonly _verifyAccountUseCase: IVerifyAccountUseCase;

  @Inject('IForgotPasswordService')
  private readonly _forgotPasswordService: IForgotPasswordService;

  @Inject('IRecoveryPasswordUseCase')
  private readonly _recoveryPasswordUseCase: IRecoveryPasswordUseCase;

  @Inject('ISignInMagicLinkUseCase')
  private readonly _signInMagicLinkUseCase: ISignInMagicLinkUseCase;

  @Inject('ISignUpMagicLinkUseCase')
  private readonly _signUpMagicLinkUseCase: ISignUpMagicLinkUseCase;

  @IsPublicRoute()
  @Post('sign-up-default')
  public async signUpDefault(@Body() input: SignUpDefaultDto): Promise<Auth> {
    const response = await this._signUpDefaultUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('sign-up-magic-link')
  public async signUpMagicLink(
    @Body() input: SignUpMagicLinkDto,
  ): Promise<Auth> {
    const response = await this._signUpMagicLinkUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('verify-account')
  @HttpCode(200)
  public async verifyAccount(
    @Body() input: VerificationCodeDto,
  ): Promise<{ message: string }> {
    const response = await this._verifyAccountUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in-default')
  @HttpCode(200)
  public async signInDefault(
    @Body() input: SignInDefaultDto,
  ): Promise<ITokensReturnsHelper> {
    const response = await this._signInDefaultUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('sign-in-magic-link')
  @HttpCode(200)
  public async signInMagicLink(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    const response = await this._signInMagicLinkUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('refresh-token')
  public async refreshToken(
    @Body() input: RefreshTokenDto,
  ): Promise<ITokensReturnsHelper> {
    const response = await this._refreshTokenService.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('forgot-password')
  public async forgotPassword(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    const response = await this._forgotPasswordService.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('recovery-password')
  public async recoveryPassword(
    @Query() input: RecoveryPasswordDto,
  ): Promise<{ message: string }> {
    const response = await this._recoveryPasswordUseCase.execute(input);

    return response;
  }
}
