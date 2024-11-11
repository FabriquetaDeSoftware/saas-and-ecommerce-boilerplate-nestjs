import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ISignUpUseCase } from './interfaces/use_cases/sign_up.use_case.interface';
import { ISignInWithCredentialsUseCase } from './interfaces/use_cases/sign_in_with_credentials.use_case.interface';
import { SignUpAuthDto } from './dto/sign_up_auth.dto';
import { Auth } from './entities/auth.entity';
import { IsPublicRoute } from '@src/shared/decorators/is_public_route.decorator';
import { SignInWithCredentialsAuthDto } from './dto/sign_in_auth.dto';
import { LocalAuthGuard } from '@src/shared/guards/local_auth.guard';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';
import { Roles } from '@src/shared/decorators/roles.decorator';
import { RolesAuth } from '@src/shared/enum/roles_auth.enum';
import { RolesGuard } from '@src/shared/guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpUseCase')
  private readonly signUpUseCase: ISignUpUseCase;

  @Inject('ISignInWithCredentialsUseCase')
  private readonly signInWithCredentialsUseCase: ISignInWithCredentialsUseCase;

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in/credentials ')
  public async signInWithCredentials(
    @Body() input: SignInWithCredentialsAuthDto,
  ): Promise<ITokensReturns> {
    return await this.signInWithCredentialsUseCase.execute(input);
  }

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in/magic-link ')
  public async signInWithMagicLink(
    @Body() input: SignInWithCredentialsAuthDto,
  ): Promise<ITokensReturns> {
    return await this.signInWithCredentialsUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-up')
  public async signUp(@Body() input: SignUpAuthDto): Promise<Auth> {
    console.log('input', input.role);
    return await this.signUpUseCase.execute(input);
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
