import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign_up.dto';
import { Auth } from './entities/auth.entity';
import { IsPublicRoute } from 'src/shared/decorators/is_public_route.decorator';
import { SignInDto } from './dto/sign_in.dto';
import { LocalAuthGuard } from './guards/local_auth.guard';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesAuth } from 'src/shared/enum/roles_auth.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { VerificationCodeDto } from './dto/verification_code.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpUseCase')
  private readonly _signUpUseCase: IGenericExecute<SignUpDto, Auth>;

  @Inject('ISignInUseCase')
  private readonly _signInUseCase: IGenericExecute<SignInDto, ITokensReturns>;

  @Inject('IRefreshTokenService')
  private readonly _refreshTokenService: IGenericExecute<
    RefreshTokenDto,
    ITokensReturns
  >;

  @Inject('IVerifyAccountUseCase')
  private readonly _verifyAccountUseCase: IGenericExecute<
    VerificationCodeDto,
    boolean
  >;

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
  @Roles(RolesAuth.ADMIN)
  @UseGuards(RolesGuard)
  public admin(): string {
    return 'Admin route';
  }

  @ApiBearerAuth()
  @Get('user')
  @Roles(RolesAuth.USER, RolesAuth.ADMIN)
  @UseGuards(RolesGuard)
  public user(): string {
    return 'User route';
  }
}
