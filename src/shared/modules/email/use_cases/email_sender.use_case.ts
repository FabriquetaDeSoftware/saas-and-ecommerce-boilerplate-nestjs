import { Injectable } from '@nestjs/common';
import { EmailSenderDto } from '../dto/email_sender.dto';
import * as nodemailer from 'nodemailer';
import { IEmailSenderUseCase } from '../interfaces/use_cases/email_sender.use_case.interface';

@Injectable()
export class EmailSenderUseCase implements IEmailSenderUseCase {
  public async execute(input: EmailSenderDto): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '348a394b31bf8e',
        pass: 'd0c1632c32bee3',
      },
    });

    const mailOptions = {
      from: '"Seu Nome" <seu-email@example.com>',
      to: input.emailTo,
      subject: input.subject,
      text: 'email texto',
      html: `<h1>email enviado para ${input.emailTo}</h1>`,
    };

    await transporter.sendMail(mailOptions);

    return;
  }
}
