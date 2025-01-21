import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign_up.dto';
import { Auth } from './entities/auth.entity';
import { IsPublicRoute } from 'src/shared/decorators/is_public_route.decorator';
import { SignInDto } from './dto/sign_in.dto';
import { LocalAuthGuard } from './guards/local_auth.guard';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { VerificationCodeDto } from './dto/verification_code.dto';
import { ISignInUseCase } from './interfaces/use_cases/sign_in.use_case.interface';
import { ISignUpUseCase } from './interfaces/use_cases/sign_up.use_case.interface';
import { IVerifyAccountUseCase } from './interfaces/use_cases/verify_account.use_case.interface';
import { IRefreshTokenService } from './interfaces/services/refresh_token.service.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpUseCase')
  private readonly _signUpUseCase: ISignUpUseCase;

  @Inject('ISignInUseCase')
  private readonly _signInUseCase: ISignInUseCase;

  @Inject('IRefreshTokenService')
  private readonly _refreshTokenService: IRefreshTokenService;

  @Inject('IVerifyAccountUseCase')
  private readonly _verifyAccountUseCase: IVerifyAccountUseCase;

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  public async signIn(@Body() input: SignInDto): Promise<ITokensReturns> {
    return await this._signInUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('refresh-token')
  public async refreshToken(
    @Body() input: RefreshTokenDto,
  ): Promise<ITokensReturns> {
    return await this._refreshTokenService.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-up')
  public async signUp(@Body() input: SignUpDto): Promise<Auth> {
    return await this._signUpUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('verification-code')
  public async verificationCode(
    @Body() input: VerificationCodeDto,
  ): Promise<boolean> {
    return await this._verifyAccountUseCase.execute(input);
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
