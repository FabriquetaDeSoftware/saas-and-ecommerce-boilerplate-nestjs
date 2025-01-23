export interface IRecoveryPasswordUseCase {
  execute(email: string, newPassword: string): Promise<void>;
}
