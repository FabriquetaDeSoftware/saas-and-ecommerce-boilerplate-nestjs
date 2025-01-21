import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/shared/decorators/is_public_route.decorator';
import { EmailServiceDto } from './dto/email.service.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';

@ApiTags('email')
@Controller('email')
export class EmailController {
  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: IGenericExecute<
    EmailServiceDto,
    { message: string }
  >;

  @IsPublicRoute()
  @Post('email-sender')
  public async emailSender(
    @Body() input: EmailServiceDto,
  ): Promise<{ message: string }> {
    return await this._sendEmailQueueJob.execute(input);
  }
}
