import { Injectable } from '@nestjs/common';
import { EmailServiceDto } from './dto/email.service.dto';
import * as nodemailer from 'nodemailer';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';

@Injectable()
export class EmailService implements IGenericExecute<EmailServiceDto, void> {
  public async execute(input: EmailServiceDto) {
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
