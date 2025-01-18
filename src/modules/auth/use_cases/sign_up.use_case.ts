import { Injectable, BadRequestException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/sign_up.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { SignUpUseCaseAbstract } from '../abstracts/use_cases/sign_up.use_case.abstract';

@Injectable()
export class SignUpUseCase
  extends SignUpUseCaseAbstract
  implements IGenericExecute<SignUpDto, Auth>
{
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

    await this._cacheManager.set(
      `verification:${data.email}`,
      verificationCodeAndExpiresDate.hashedCode,
      twentyFourHoursInSeconds,
    );

    const result = await this._authRepository.create(
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
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (findUserByEmail) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await this._hashUtil.generateHash(password);
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

    const hashedCode = await this._hashUtil.generateHash(verificationCode);

    return { expiresDate, hashedCode };
  }
}
