import { Injectable } from '@nestjs/common';
import { EmailServiceDto } from './dto/email.service.dto';

@Injectable()
export class EmailService {
  public async sendEmail(input: EmailServiceDto) {}
}
