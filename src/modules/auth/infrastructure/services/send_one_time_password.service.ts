import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ISendOneTimePasswordService } from '../../domain/interfaces/services/send_one_time_password.service.interface';
import { EmailDto } from '../../application/dto/email.dto';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/application/enum/template.enum';
import { User } from 'src/shared/entities/user.entity';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { IOneTimePasswordRepository } from '../../domain/interfaces/repositories/one_time_password.repository.interface';

Injectable();
export class SendOneTimePasswordService implements ISendOneTimePasswordService {
  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateNumberCodeUtil')
  private readonly _generateCodeOfVerificationUtil: IGenerateNumberCodeUtil;

  @Inject('IOneTimePasswordRepository')
  private readonly _oneTimePasswordRepository: IOneTimePasswordRepository;

  public async execute(input: EmailDto): Promise<{ message: string }> {
    const result = await this.intermediary(input.email);

    return result;
  }

  private async intermediary(email: string): Promise<{ message: string }> {
    const findUserByEmail = await this.validateUser(email);

    const otp = await this.generateOneTimePasswordAndExpiresDate();

    await this._oneTimePasswordRepository.create(
      otp.hashedCode,
      findUserByEmail.id,
      otp.expiresDate,
    );

    return await this._sendEmailQueueJob.execute({
      emailTo: email,
      language: LanguageEnum.PT_BR,
      subject: 'Login com senha de uso único',
      template: TemplateEnum.ONE_TIME_PASSWORD,
      variables: {
        NAME: findUserByEmail.name,
        OTP: otp.code,
      },
    });
  }

  private async validateUser(email: string): Promise<Partial<User>> {
    const user = await this._findUserByEmailHelper.execute(email);

    if (!user || !user.is_verified_account) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return user;
  }

  private async generateOneTimePasswordAndExpiresDate(): Promise<{
    expiresDate: Date;
    hashedCode: string;
    code: string;
  }> {
    const fiveMinutesInMilliseconds = 300_000;

    const code = await this._generateCodeOfVerificationUtil.execute(
      fiveMinutesInMilliseconds,
    );

    return code;
  }
}
