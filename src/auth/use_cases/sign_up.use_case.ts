import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IHashUtil } from '../../shared/utils/interfaces/hash.util.interface';
import { IGenericExecute } from '../../shared/interfaces/generic_execute.interface';

@Injectable()
export class SignUpUseCase implements IGenericExecute<SignUpAuthDto, Auth> {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IHashUtil')
  private readonly hashUtil: IHashUtil;

  public async execute(input: SignUpAuthDto): Promise<Auth> {
    console.log('input', input.role);
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

  private async hashPassword(password: string): Promise<string> {
    return await this.hashUtil.generateHash(password);
  }
}
