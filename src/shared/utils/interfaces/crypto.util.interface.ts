export interface ICryptoUtil {
  encryptData(data: string): Promise<Buffer>;
  decryptData(data: Buffer): Promise<Buffer>;
}
