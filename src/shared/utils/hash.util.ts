import { Injectable } from '@nestjs/common';
import { IHashUtil } from './interfaces/hash.util.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashUtil implements IHashUtil {
  public async generateHash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  public async compareHash(
    data: string | Buffer,
    hash: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(data, hash);

    return isMatch;
  }
}
