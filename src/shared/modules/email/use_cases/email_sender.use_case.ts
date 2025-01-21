import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderDto } from '../dto/email_sender.dto';
import * as nodemailer from 'nodemailer';
import { IEmailSenderUseCase } from '../interfaces/use_cases/email_sender.use_case.interface';
import { IProcessHTMLUtil } from 'src/shared/utils/interfaces/proccess_html.interface';

@Injectable()
export class EmailSenderUseCase implements IEmailSenderUseCase {
  @Inject('IProccessHtmlUtil')
  private readonly _processHTMLUtil: IProcessHTMLUtil;

  public async execute(input: EmailSenderDto): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '348a394b31bf8e',
        pass: 'd0c1632c32bee3',
      },
    });

    const templatePath = `/home/api/nestjs/auth-boilerplate/src/shared/modules/email/templates/${input.language}/${input.template}`;

    const proccedTemplate = await this.intermediary(
      templatePath,
      input.variables,
    );

    const mailOptions = {
      from: '"Seu Nome" <seu-email@example.com>',
      to: input.emailTo,
      subject: input.subject,
      html: proccedTemplate,
    };

    await transporter.sendMail(mailOptions);

    return;
  }

  private async intermediary(
    pathHTML: string,
    variables?: Record<string, string>,
  ): Promise<string> {
    return await this.proccessTemplate(pathHTML, variables);
  }

  private async proccessTemplate(
    pathHTML: string,
    variables?: Record<string, string>,
  ): Promise<string> {
    return await this._processHTMLUtil.execute(pathHTML, variables);
  }
}
