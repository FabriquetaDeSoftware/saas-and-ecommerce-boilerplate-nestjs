import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderDto } from '../../application/dto/email_sender.dto';
import * as nodemailer from 'nodemailer';
import { IEmailSenderService } from '../../domain/interfaces/services/email_sender.service.interface';
import { IProcessHTMLUtil } from 'src/shared/utils/interfaces/proccess_html.interface';
import { emailConstants } from '../../domain/constants/email.constants';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  @Inject('IProccessHtmlUtil')
  private readonly _processHTMLUtil: IProcessHTMLUtil;

  public async execute(input: EmailSenderDto): Promise<void> {
    console.log(emailConstants);
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
      from: `"Seu Nome" ${emailConstants.email_from}`,
      to: input.emailTo,
      subject: input.subject,
      html: processedTemplate,
    };

    const transporter = this.transporter();

    await transporter.sendMail(mailOptions);

    return;
  }

  private async generateTemplate(input: EmailSenderDto): Promise<string> {
    const templatePath = `${emailConstants.email_template_base_path}/${input.language}/${input.template}`;

    const processedTemplate = await this._processHTMLUtil.execute(
      templatePath,
      input.variables,
    );

    return processedTemplate;
  }

  private transporter(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
      host: emailConstants.email_host,
      port: parseInt(emailConstants.email_port),
      auth: {
        user: emailConstants.email_user,
        pass: emailConstants.email_password,
      },
    });

    return transporter;
  }
}
