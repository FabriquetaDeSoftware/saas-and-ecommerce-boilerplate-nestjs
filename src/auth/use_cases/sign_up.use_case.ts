import { Injectable } from '@nestjs/common';
import { ISignUpUseCase } from '../interfaces/use_cases/sign_up.use_case.interface';

@Injectable()
export class SignUpUseCase implements ISignUpUseCase {
  async execute() {}
}
