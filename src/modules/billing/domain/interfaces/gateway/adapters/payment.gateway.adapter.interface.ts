export interface IPaymentGatewayAdapter {
  createOneTimePayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
  ): Promise<{ url: string }>;
  createSubscriptionPayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
  ): Promise<{ url: string }>;
  handleWebhookEvent(
    payload: Buffer<ArrayBufferLike>,
    signature: string,
  ): Promise<void>;
}
