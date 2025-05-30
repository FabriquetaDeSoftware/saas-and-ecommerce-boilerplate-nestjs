import { Inject, Injectable } from '@nestjs/common';
import { EmailSenderDto } from '../../application/dto/email_sender.dto';
import * as nodemailer from 'nodemailer';
import { IEmailSenderService } from '../../domain/interfaces/services/email_sender.service.interface';
import { IProcessHtmlHelper } from 'src/shared/modules/email/domain/interfaces/helpers/proccess_html.helper.interface';
import { EnvService } from 'src/common/modules/services/env.service';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  @Inject()
  private readonly _envService: EnvService;

  @Inject('IProcessHtmlHelper')
  private readonly _processHTMLUtil: IProcessHtmlHelper;

  private readonly _emailTemplateBasePath: 'src/shared/modules/email/infrastructure/templates';

  public async execute(input: EmailSenderDto): Promise<void> {
    await this.intermediary(input);

    return;
  }

  private async intermediary(input: EmailSenderDto): Promise<void> {
    const processedTemplate = await this.generateTemplate(input);

    await this.sendEmail(input, processedTemplate);

    return;
  }

  private async sendEmail(
    input: EmailSenderDto,
    processedTemplate: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Seu Nome" <${this._envService.emailFrom}>`,
      to: input.emailTo,
      subject: input.subject,
      html: processedTemplate,
    };

    const transporter = this.transporter();

    await transporter.sendMail(mailOptions);

    return;
  }

  private async generateTemplate(input: EmailSenderDto): Promise<string> {
    const templatePath = `${this._emailTemplateBasePath}/${input.language}/${input.template}`;

    const processedTemplate = await this._processHTMLUtil.execute(
      templatePath,
      input.variables,
    );

    return processedTemplate;
  }

  private transporter(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
      host: this._envService.emailHost,
      port: this._envService.emailPort,
      auth: {
        user: this._envService.emailUser,
        pass: this._envService.emailPassword,
      },
      debug: true,
    });

    return transporter;
  }
}
