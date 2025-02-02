export interface IProcessOneTimePaymentUseCase {
  exceute(priceId: string): Promise<string>;
}
