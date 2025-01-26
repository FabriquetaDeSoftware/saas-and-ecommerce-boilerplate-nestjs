import {
  Body,
  Controller,
  Get,
  Inject,
  NotImplementedException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../../application/dto/sign_up.dto';
import { Auth } from '../../domain/entities/auth.entity';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { SignInDto } from '../../application/dto/sign_in.dto';
import { LocalAuthGuard } from '../guards/local_auth.guard';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
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
import { ISignUpMagicLinkseCase } from '../../domain/interfaces/use_cases/sign_up_magic_link.use_case.interface';

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

  @Inject('ISignUpMagicLinkseCase')
  private readonly _signUpMagicLinkseCase: ISignUpMagicLinkseCase;

  @IsPublicRoute()
  @Post('sign-up-default')
  public async signUpDefault(@Body() input: SignUpDto): Promise<Auth> {
    return await this._signUpDefaultUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-up-magic-link')
  public async signUpMagicLink(
    @Body() input: SignUpMagicLinkDto,
  ): Promise<Auth> {
    return await this._signUpMagicLinkseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('verify-account')
  public async verifyAccount(
    @Body() input: VerificationCodeDto,
  ): Promise<{ message: string }> {
    return await this._verifyAccountUseCase.execute(input);
  }

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in-default')
  public async signInDefault(
    @Body() input: SignInDto,
  ): Promise<ITokensReturnsHelper> {
    return await this._signInDefaultUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-in-magic-link')
  public async signInMagicLink(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    return await this._signInMagicLinkUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('refresh-token')
  public async refreshToken(
    @Body() input: RefreshTokenDto,
  ): Promise<ITokensReturnsHelper> {
    return await this._refreshTokenService.execute(input);
  }

  @IsPublicRoute()
  @Post('forgot-password')
  public async forgotPassword(
    @Body() input: EmailDto,
  ): Promise<{ message: string }> {
    return await this._forgotPasswordService.execute(input);
  }

  @IsPublicRoute()
  @Post('recovery-password')
  public async recoveryPassword(
    @Query() input: RecoveryPasswordDto,
  ): Promise<{ message: string }> {
    return await this._recoveryPasswordUseCase.execute(input);
  }

  @ApiBearerAuth()
  @Get('all')
  public all(): string {
    return 'All route';
  }

  @ApiBearerAuth()
  @Get('admin')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public admin(): string {
    return 'Admin route';
  }

  @ApiBearerAuth()
  @Get('user')
  @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public user(): string {
    return 'User route';
  }
}
