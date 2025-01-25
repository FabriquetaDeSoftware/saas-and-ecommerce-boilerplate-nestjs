import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderDto } from '../dto/email_sender.dto';
import * as nodemailer from 'nodemailer';
import { IEmailSenderUseCase } from '../../interfaces/use_cases/email_sender.use_case.interface';
import { IProcessHTMLUtil } from 'src/shared/utils/interfaces/proccess_html.interface';

@Injectable()
export class EmailSenderUseCase implements IEmailSenderUseCase {
  @Inject('IProccessHtmlUtil')
  private readonly _processHTMLUtil: IProcessHTMLUtil;

  private readonly _templateBasePath =
    '/home/api/nestjs/auth-boilerplate/src/shared/modules/email/templates';

  public async execute(input: EmailSenderDto): Promise<void> {
    return await this.intermediary(input);
  }

  private async intermediary(input: EmailSenderDto): Promise<void> {
    const processedTemplate = await this.generateTemplate(input);

    return await this.sendEmail(input, processedTemplate);
  }

  private async sendEmail(
    input: EmailSenderDto,
    processedTemplate: string,
  ): Promise<void> {
    const mailOptions = {
      from: '"Seu Nome" <seu-email@example.com>',
      to: input.emailTo,
      subject: input.subject,
      html: processedTemplate,
    };

    const transporter = this.transporter();

    await transporter.sendMail(mailOptions);

    return;
  }

  private async generateTemplate(input: EmailSenderDto): Promise<string> {
    const templatePath = `${this._templateBasePath}/${input.language}/${input.template}`;

    const processedTemplate = await this._processHTMLUtil.execute(
      templatePath,
      input.variables,
    );

    return processedTemplate;
  }

  private transporter(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '348a394b31bf8e',
        pass: 'd0c1632c32bee3',
      },
    });

    return transporter;
  }
}
