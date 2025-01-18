import { Injectable } from '@nestjs/common';
import { ICryptoUtil } from './interfaces/crypto.util.interface';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { serverConstants } from '../constants/server.constant';

@Injectable()
export class CryptoUtil implements ICryptoUtil {
  public async encryptData(data: string): Promise<Buffer> {
    const iv = randomBytes(16);

    const key = await this.generateKey();
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([cipher.update(data), cipher.final()]);

    return Buffer.concat([iv, encryptedText]);
  }

  public async decryptData(data: Buffer): Promise<Buffer> {
    const extractIvAndData = this.extractIvAndData(data);
    const key = await this.generateKey();

    const decipher = createDecipheriv('aes-256-ctr', key, extractIvAndData.iv);
    const decryptedText = Buffer.concat([
      decipher.update(extractIvAndData.data),
      decipher.final(),
    ]);

    return decryptedText;
  }

  private extractIvAndData(data: Buffer): { iv: Buffer; data: Buffer } {
    const ivWithoutData = data.subarray(0, 16);
    const dataWithoutIv = data.subarray(16);

    return { iv: ivWithoutData, data: dataWithoutIv };
  }

  private async generateKey(): Promise<Buffer> {
    const password = serverConstants.encrypt_password;
    const salt = serverConstants.encrypt_salt;
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    return key;
  }
}
