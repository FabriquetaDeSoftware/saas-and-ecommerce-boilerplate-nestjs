export interface IForgotPasswordService {
  execute(email: string): Promise<{ message: string }>;
}
