import { Injectable } from '@nestjs/common';
import { IForgotPasswordService } from '../interfaces/services/recovery_password.service.interface';

@Injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  public async execute(): Promise<void> {}
}
