import { Injectable } from '@nestjs/common';
import { IGenerateNumberCodeUtil } from './interfaces/generate_number_code.util.interface';

@Injectable()
export class GenerateNumberCodeUtil implements IGenerateNumberCodeUtil {
  public async execute(): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    return code;
  }
}
