import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IForgotPasswordService } from '../interfaces/services/forgot_password.service.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/interfaces/jobs/send_email_queue.job.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/enum/template.enum';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';

@Injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  public async execute(email: string): Promise<{ message: string }> {
    return await this.intermediary(email);
  }

  private async intermediary(email: string): Promise<{ message: string }> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new NotFoundException('User not found');
    }

    return await this._sendEmailQueueJob.execute({
      emailTo: email,
      language: LanguageEnum.PT_BR,
      subject: 'Recuperação de senha',
      template: TemplateEnum.PASSWORD_RECOVERY,
      variables: { NAME: email, LINK: 'http://example.com' },
    });
  }
}
