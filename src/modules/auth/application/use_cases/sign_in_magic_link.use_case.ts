import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateTokenHelper } from '../../domain/interfaces/helpers/generate_token.helper.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { EmailDto } from '../dto/email.dto';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from 'src/shared/modules/email/application/enum/template.enum';
import { ISignInMagicLinkUseCase } from '../../domain/interfaces/use_cases/sign_in_magic_link.use_case';

@Injectable()
export class SignInMagicLinkUseCase implements ISignInMagicLinkUseCase {
  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  public async execute(input: EmailDto): Promise<{ message: string }> {
    return await this.intermediary(input.email);
  }

  private async intermediary(email: string): Promise<{ message: string }> {
    const findUserByEmail = await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this._generateTokenUtil.execute({
        sub: findUserByEmail.public_id,
        email: findUserByEmail.email,
        role: findUserByEmail.role,
      });

    return await this._sendEmailQueueJob.execute({
      emailTo: email,
      language: LanguageEnum.PT_BR,
      subject: 'Login com link mágico',
      template: TemplateEnum.MAGIC_LINK_LOGIN,
      variables: {
        NAME: email,
        LINK: `http://example.com/recovery-password?access_token=${access_token}&refresh_token=${refresh_token}`,
      },
    });
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return findUserByEmail;
  }
}
