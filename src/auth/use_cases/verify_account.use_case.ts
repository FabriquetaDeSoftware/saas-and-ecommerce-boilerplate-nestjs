import { Inject, Injectable } from '@nestjs/common';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { VerificationCodeAuthDto } from '../dto/verification_code_auth.dto';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IVerificationCodesRepository } from '../interfaces/repository/verification_codes.repository.interface';
import { Auth } from '../entities/auth.entity';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

@Injectable()
export class VerifyAccountUseCase
  implements IGenericExecute<VerificationCodeAuthDto, boolean>
{
  @Inject('IVerificationCodesRepository')
  private readonly _verificationCodesRepository: IVerificationCodesRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IGenericExecute<string, Auth | void>;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  public async execute(data: VerificationCodeAuthDto): Promise<boolean> {
    return await this.intermediary(data);
  }

  private async intermediary(data: VerificationCodeAuthDto): Promise<boolean> {
    const user = await this.findUserByEmail(data.email);

    const verificationCode =
      await this._verificationCodesRepository.findVerificationCodeByEmail(
        user.id,
      );

    await this.verifyCode(data.code.toString(), verificationCode.code);

    await this.updateAccountIsVerify(user.id, true);

    return true;
  }

  private async updateAccountIsVerify(
    id: number,
    is_verified_account: boolean,
  ): Promise<Auth> {
    const result = await this._authRepository.updateInfoAuth({
      id,
      is_verified_account,
    });

    return result;
  }

  private async verifyCode(code: string, hashedCode: string): Promise<boolean> {
    const isMatch = await this._hashUtil.compareHash(code, hashedCode);

    if (!isMatch) {
      return null;
    }

    return isMatch;
  }

  private async findUserByEmail(email: string): Promise<Auth> {
    const user = await this._findUserByEmailHelper.execute(email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
