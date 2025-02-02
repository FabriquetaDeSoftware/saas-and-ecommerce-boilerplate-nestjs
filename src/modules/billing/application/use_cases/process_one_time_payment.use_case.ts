import { Injectable } from '@nestjs/common';
import { IProcessOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/process_one_time_payment.use_case.interface';

@Injectable()
export class ProcessOneTimePaymentUseCase
  implements IProcessOneTimePaymentUseCase
{
  exceute(priceId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
