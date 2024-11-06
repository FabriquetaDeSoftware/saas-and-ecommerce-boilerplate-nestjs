import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ISignUpUseCase } from './interfaces/use_cases/sign_up.use_case.interface';
import { ISignInUseCase } from './interfaces/use_cases/sign_in.use_case.interface';
import { SignUpAuthDto } from './dto/sign_up_auth.dto';
import { Auth } from './entities/auth.entity';
import { IsPublicRoute } from '@src/shared/decorators/is_public_route.decorator';
import { SignInAuthDto } from './dto/sign_in_auth.dto';
import { LocalAuthGuard } from './guards/local_auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpUseCase')
  private readonly signUpUseCase: ISignUpUseCase;

  @Inject('ISignInUseCase')
  private readonly signInUseCase: ISignInUseCase;

  @IsPublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  public async signIn(@Body() input: SignInAuthDto): Promise<Auth> {
    return await this.signInUseCase.execute(input);
  }

  @IsPublicRoute()
  @Post('sign-up')
  public async signUp(@Body() input: SignUpAuthDto): Promise<Auth> {
    return await this.signUpUseCase.execute(input);
  }
}
