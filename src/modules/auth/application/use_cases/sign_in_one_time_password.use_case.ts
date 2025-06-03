import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ISignInOneTimePasswordUseCase } from '../../domain/interfaces/use_cases/sign_in_one_time_password.use_case.interface';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { SignInOneTimePasswordDto } from '../dto/sign_in_one_time_password.dto';
import { IGenerateTokenHelper } from '../../domain/interfaces/helpers/generate_token.helper.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { User } from 'src/shared/entities/user.entity';

Injectable();
export class SignInOneTimePasswordUseCase
  implements ISignInOneTimePasswordUseCase
{
  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  public async execute(
    input: SignInOneTimePasswordDto,
  ): Promise<ITokensReturnsHelper> {
    const result = await this.intermediary(input.email);

    return result;
  }

  private async intermediary(email: string): Promise<ITokensReturnsHelper> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this._generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
        name: findUserByEmail.name,
      });

    return { access_token, refresh_token };
  }

  private async checkEmailExistsOrError(email: string): Promise<Partial<User>> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return findUserByEmail;
  }
}
