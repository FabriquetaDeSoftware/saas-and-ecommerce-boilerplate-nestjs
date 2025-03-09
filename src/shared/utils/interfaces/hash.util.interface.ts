export interface IHashUtil {
  generateHash(data: string): Promise<string>;
  compareHash(data: string, hash: string): Promise<boolean>;
}
