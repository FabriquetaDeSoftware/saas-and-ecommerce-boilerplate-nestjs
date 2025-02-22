export interface IDeleteSingleProductUseCase {
  execute(role: string, input: string): Promise<void>;
}
