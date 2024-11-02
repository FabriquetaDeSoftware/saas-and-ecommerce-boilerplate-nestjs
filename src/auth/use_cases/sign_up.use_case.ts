import { Inject, Injectable } from '@nestjs/common';
import { ISignUpUseCase } from '../interfaces/use_cases/sign_up.use_case.interface';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';

@Injectable()
export class SignUpUseCase implements ISignUpUseCase {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  public async execute(input: SignUpAuthDto): Promise<Auth> {
    return await this.authRepository.create(input);
  }
}
