import { Injectable } from '@nestjs/common';
import { EmailServiceDto } from './dto/email.service.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  public async sendEmail(input: EmailServiceDto) {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '348a394b31bf8e',
        pass: 'd0c1632c32bee3',
      },
    });

    const mailOptions = {
      from: '"Seu Nome" <seu-email@example.com>', // Remetente
      to: 'lobohipster52@gmail.com',
      subject: 'email assunto',
      text: 'email texto',
      html: '<h1>email html</h1>',
    };

    await transporter.sendMail(mailOptions);
  }
}
