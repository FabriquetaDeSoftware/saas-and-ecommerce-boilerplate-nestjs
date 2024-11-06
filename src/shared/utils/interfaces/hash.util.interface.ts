export interface IHashUtil {
  generateHash(data: string | Buffer): Promise<string>;
  compareHash(data: string | Buffer, hash: string): Promise<boolean>;
}
