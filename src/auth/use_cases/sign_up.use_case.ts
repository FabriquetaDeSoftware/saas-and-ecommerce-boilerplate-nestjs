import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';
import { IGenericExecute } from '../../shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';

@Injectable()
export class SignUpUseCase implements IGenericExecute<SignUpAuthDto, Auth> {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IHashUtil')
  private readonly hashUtil: IHashUtil;

  @Inject('IGenerateCodeOfVerificationUtil')
  private readonly _generateCodeOfVerificationUtil: IGenericExecute<
    void,
    string
  >;

  public async execute(input: SignUpAuthDto): Promise<Auth> {
    console.log('input', input.role);
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpAuthDto): Promise<Auth> {
    const [, hashedPassword, verificationCodeAndExpiresDate] =
      await Promise.all([
        this.checkEmailExistsAndError(data.email),
        this.hashPassword(data.password),
        this.generateCodeOfVerificationAndExpiresDate(),
      ]);

    const result = await this.authRepository.create(
      {
        ...data,
        password: hashedPassword,
      },
      verificationCodeAndExpiresDate.hashedCode,
      verificationCodeAndExpiresDate.expiresDate,
    );

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

  private async generateCodeOfVerificationAndExpiresDate(): Promise<{
    expiresDate: Date;
    hashedCode: string;
  }> {
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    const expiresDate = new Date(
      new Date().getTime() + twentyFourHoursInMilliseconds,
    );

    const verificationCode =
      await this._generateCodeOfVerificationUtil.execute();

    const hashedCode = await this.hashUtil.generateHash(verificationCode);

    return { expiresDate, hashedCode };
  }
}
