import { Injectable } from '@nestjs/common';
import { IGenericExecute } from '../interfaces/generic_execute.interface';

@Injectable()
export class GenerateCodeOfVerificationUtil
  implements IGenericExecute<void, string>
{
  public async execute(): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    return code;
  }
}
