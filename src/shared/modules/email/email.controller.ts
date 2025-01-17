import { Controller, Inject } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  @Inject()
  private readonly _emailService: EmailService;
}
