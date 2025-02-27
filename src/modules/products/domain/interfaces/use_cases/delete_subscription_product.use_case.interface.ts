export interface IDeleteSubscriptionProductUseCase {
  execute(role: string, input: string): Promise<void>;
}
