import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ISignUpUseCase } from '@auth/interfaces/use_cases/sign_up.use_case.interface';
import { ISignInUseCase } from '@auth/interfaces/use_cases/sign_in.use_case.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject('ISignUpUseCase')
  private readonly signUpUseCase: ISignUpUseCase;

  @Inject('ISignInUseCase')
  private readonly signInUseCase: ISignInUseCase;
}
