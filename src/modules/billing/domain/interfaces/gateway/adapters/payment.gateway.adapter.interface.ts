export interface IPaymentGatewayAdapter {
  createOneTimePayment(priceId: string): Promise<{ url: string }>;
  createSubscriptionPayment(priceId: string): Promise<{ url: string }>;
  handleWebhookEvent(
    payload: Buffer<ArrayBufferLike>,
    signature: string,
  ): Promise<void>;
}
