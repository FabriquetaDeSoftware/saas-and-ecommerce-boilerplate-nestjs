import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignUpAuthDto } from './dto/sign_up_auth.dto';
import { Auth } from './entities/auth.entity';
import { IsPublicRoute } from '../shared/decorators/is_public_route.decorator';
import { SignInAuthDto } from './dto/sign_in_auth.dto';
import { LocalAuthGuard } from '../shared/guards/local_auth.guard';
import { ITokensReturns } from '../shared/interfaces/tokens_returns.interface';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesAuth } from '../shared/enum/roles_auth.enum';
import { RolesGuard } from '../shared/guards/roles.guard';
import { VerificationCodeAuthDto } from './dto/verification_code_auth.dto';
import { RefreshTokenAuthDto } from './dto/refresh_token_auth.dto';
import { AuthControllerAbstract } from './abstracts/controller/auth.controller.abstract';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends AuthControllerAbstract {
  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  public async signIn(@Body() input: SignInAuthDto): Promise<ITokensReturns> {
    return await this._signInUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('refresh-token')
  public async refreshToken(
    @Body() input: RefreshTokenAuthDto,
  ): Promise<ITokensReturns> {
    return await this._refreshTokenService.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-up')
  public async signUp(@Body() input: SignUpAuthDto): Promise<Auth> {
    return await this._signUpUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('verification-code')
  public verificationCode(
    @Body() input: VerificationCodeAuthDto,
  ): VerificationCodeAuthDto {
    return input;
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
