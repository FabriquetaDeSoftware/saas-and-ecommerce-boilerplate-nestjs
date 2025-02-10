export interface ISubscriptionPaymentUseCase {
  execute(priceId: string): Promise<{ url: string }>;
}
