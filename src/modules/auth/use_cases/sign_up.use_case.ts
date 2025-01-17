import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/sign_up.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SignUpUseCase implements IGenericExecute<SignUpDto, Auth> {
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

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

  public async execute(input: SignUpDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpDto): Promise<Auth> {
    const [, hashedPassword, verificationCodeAndExpiresDate] =
      await Promise.all([
        this.checkEmailExistsAndError(data.email),
        this.hashPassword(data.password),
        this.generateCodeOfVerificationAndExpiresDate(),
      ]);

    const twentyFourHoursInSeconds = 86400;

    await this.cacheManager.set(
      `verification:${data.email}`,
      verificationCodeAndExpiresDate.hashedCode,
      twentyFourHoursInSeconds,
    );

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
      throw new BadRequestException('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await this.hashUtil.generateHash(password);
  }

  private async generateCodeOfVerificationAndExpiresDate(): Promise<{
    expiresDate: Date;
    hashedCode: string;
  }> {
    const twentyFourHoursInMilliseconds = 86400000;
    const expiresDate = new Date(
      new Date().getTime() + twentyFourHoursInMilliseconds,
    );

    const verificationCode =
      await this._generateCodeOfVerificationUtil.execute();

    const hashedCode = await this.hashUtil.generateHash(verificationCode);

    return { expiresDate, hashedCode };
  }
}
