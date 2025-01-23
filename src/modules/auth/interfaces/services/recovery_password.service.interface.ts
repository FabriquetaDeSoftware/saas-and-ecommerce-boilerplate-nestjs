export interface IForgotPasswordService {
  execute(email: string, newPassword: string): Promise<void>;
}
