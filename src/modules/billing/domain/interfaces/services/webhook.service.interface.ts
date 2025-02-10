export interface IWebhookService {
  execute(payload: Buffer<ArrayBufferLike>, signature: string): Promise<void>;
}
