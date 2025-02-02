import { Injectable } from '@nestjs/common';
import { IProcessSubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/process_subscription_payment.use_case.interface';

@Injectable()
export class ProcessSubscriptionPaymentUseCase
  implements IProcessSubscriptionPaymentUseCase {}
