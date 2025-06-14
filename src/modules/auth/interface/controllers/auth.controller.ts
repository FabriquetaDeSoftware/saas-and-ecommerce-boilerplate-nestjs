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
import { User } from 'src/shared/entities/user.entity';
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
import { PasswordDto } from '../../application/dto/password.dto';
import { EmailDto } from '../../application/dto/email.dto';
import { IRecoveryPasswordUseCase } from '../../domain/interfaces/use_cases/recovery_password.use_case.interface';
import { ISignInMagicLinkUseCase } from '../../domain/interfaces/use_cases/sign_in_magic_link.use_case';
import { SignUpMagicLinkDto } from '../../application/dto/sign_up_magic_link.dto';
import { ISignUpPasswordLessUseCase } from '../../domain/interfaces/use_cases/sign_up_magic_link.use_case.interface';
import { ISendOneTimePasswordService } from '../../domain/interfaces/services/send_one_time_password.service.interface';
import { ISignInOneTimePasswordUseCase } from '../../domain/interfaces/use_cases/sign_in_one_time_password.use_case.interface';

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

  @Inject('ISignUpPasswordLessUseCase')
  private readonly _signUpPasswordLessUseCase: ISignUpPasswordLessUseCase;

  @Inject('ISendOneTimePasswordService')
  private readonly _sendOneTimePasswordService: ISendOneTimePasswordService;

  @Inject('ISignInOneTimePasswordUseCase')
  private readonly _signInOneTimePasswordUseCase: ISignInOneTimePasswordUseCase;

  @IsPublicRoute()
  @Post('sign-up-default')
  public async signUpDefault(
    @Body() input: SignUpDefaultDto,
  ): Promise<Partial<User>> {
    const response = await this._signUpDefaultUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('sign-up-password-less')
  public async signUpMagicLink(
    @Body() input: SignUpMagicLinkDto,
  ): Promise<Partial<User>> {
    const response = await this._signUpPasswordLessUseCase.execute(input);

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
  @Post('send-one-time-password')
  @HttpCode(200)
  public async sendTemporaryPassword(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    const response = await this._sendOneTimePasswordService.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('sign-in-one-time-password')
  @HttpCode(200)
  public async signInTemporaryPassword(
    @Body() input: SignInDefaultDto,
  ): Promise<ITokensReturnsHelper> {
    const response = await this._signInOneTimePasswordUseCase.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('refresh-token')
  @HttpCode(200)
  public async refreshToken(
    @Body() input: RefreshTokenDto,
  ): Promise<ITokensReturnsHelper> {
    const response = await this._refreshTokenService.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('forgot-password')
  @HttpCode(200)
  public async forgotPassword(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    const response = await this._forgotPasswordService.execute(input);

    return response;
  }

  @IsPublicRoute()
  @Post('recovery-password')
  @HttpCode(200)
  public async recoveryPassword(
    @Query('token') query: string,
    @Body() input: PasswordDto,
  ): Promise<{ message: string }> {
    const response = await this._recoveryPasswordUseCase.execute(query, input);

    return response;
  }
}
