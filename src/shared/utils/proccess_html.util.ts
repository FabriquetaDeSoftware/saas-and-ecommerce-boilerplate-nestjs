import { Injectable } from '@nestjs/common';
import { IGenericExecute } from '../interfaces/generic_execute.interface';

@Injectable()
export class ProccessHtmlUtil implements IGenericExecute<string, void> {
  public async execute(pathHTML: string): Promise<void> {
    return;
  }
}
