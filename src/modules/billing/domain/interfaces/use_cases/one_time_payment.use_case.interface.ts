export interface IOneTimePaymentUseCase {
  execute(priceId: string): Promise<{ url: string }>;
}
