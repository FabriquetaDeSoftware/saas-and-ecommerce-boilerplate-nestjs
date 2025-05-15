import { Injectable } from '@nestjs/common';
import { IHashUtil } from './interfaces/hash.util.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashUtil implements IHashUtil {
  public async generateHash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);

    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  public async compareHash(data: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, hash);

    return isMatch;
  }
}
