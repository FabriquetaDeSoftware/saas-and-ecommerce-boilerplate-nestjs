import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '@src/auth/entities/auth.entity';
import { SignUpAuthDto } from '@src/auth/dto/sign_up_auth.dto';
import { IAuthRepository } from '@src/auth/interfaces/repository/auth.repository.interface';
import { ISignUpUseCase } from '@src/auth/interfaces/use_cases/sign_up.use_case.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';

@Injectable()
export class SignUpUseCase implements ISignUpUseCase {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IFindUserByEmailHelper;

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

  private async checkEmailExistsAndError(email: string): Promise<void> {
    const findUserByEmail = await this.findUserByEmailHelper.execute(email);

    if (findUserByEmail) {
      throw new Error('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {}
}
