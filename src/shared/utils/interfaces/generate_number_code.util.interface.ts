export interface IGenerateNumberCodeUtil {
  execute(
    milliSecondsToExpire: number,
  ): Promise<{ expiresDate: Date; hashedCode: string; code: string }>;
}
