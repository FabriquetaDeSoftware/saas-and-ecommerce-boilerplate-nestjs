export interface IRecoveryPasswordUseCase {
  execute(email: string): Promise<void>;
}
