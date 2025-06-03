import { Inject, Injectable } from '@nestjs/common';
import { IGenerateNumberCodeUtil } from './interfaces/generate_number_code.util.interface';
import { IHashUtil } from './interfaces/hash.util.interface';

@Injectable()
export class GenerateNumberCodeUtil implements IGenerateNumberCodeUtil {
  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  public async execute(
    milliSecondsToExpire: number,
  ): Promise<{ expiresDate: Date; hashedCode: string; code: string }> {
    const expiresDate = new Date(new Date().getTime() + milliSecondsToExpire);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedCode = await this._hashUtil.generateHash(code);

    return { expiresDate, hashedCode, code };
  }
}
