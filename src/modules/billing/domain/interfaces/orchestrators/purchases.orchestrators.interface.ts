export interface IPurchasesOrchestrators {
  savePurchaseProductToUser(
    paymentType: string,
    customerId: string,
    productId: string,
  ): Promise<{ message: string }>;
}
