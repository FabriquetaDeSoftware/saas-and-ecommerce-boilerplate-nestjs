import { Injectable } from '@nestjs/common';
import { ISignInUseCase } from '../interfaces/use_cases/sign_in.use_case.interface';

@Injectable()
export class SignInUseCase implements ISignInUseCase {
  async execute() {}

  async validateUser() {}
}
