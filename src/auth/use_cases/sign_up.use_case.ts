import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '@auth/entities/auth.entity';
import { SignUpAuthDto } from '@auth/dto/sign_up_auth.dto';
import { IAuthRepository } from '@auth/interfaces/repository/auth.repository.interface';
import { IGenericExecutable } from '@src/shared/interfaces/generic_executable.interface';

@Injectable()
export class SignUpUseCase implements IGenericExecutable<SignUpAuthDto, Auth> {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  public async execute(input: SignUpAuthDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpAuthDto): Promise<Auth> {
    const [, hashedPassword] = await Promise.all([
      this.checkEmailExistsAndError(data.email),
      this.hashPassword(data.password),
    ]);

    const result = await this.authRepository.create({
      ...data,
      password: hashedPassword,
    });

    return { ...result, password: undefined };
  }

  private async checkEmailExistsAndError(email: string): Promise<void> {}

  private async hashPassword(password: string): Promise<string> {}
}
