export interface IDeleteProductUseCase {
  execute(role: string, input: string): Promise<void>;
}
