import { Inject, Injectable } from '@nestjs/common';
import { ISignInUseCase } from '../interfaces/use_cases/sign_in.use_case.interface';
import { SignInAuthDto } from '../dto/ sign_in_auth.dto';
import { Auth } from '../entities/auth.entity';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';

@Injectable()
export class SignInUseCase implements ISignInUseCase {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  async execute(input: SignInAuthDto): Promise<Auth> {
    return await this.authRepository.findOneByEmail(input.email);
  }

  async validateUser() {}
}
