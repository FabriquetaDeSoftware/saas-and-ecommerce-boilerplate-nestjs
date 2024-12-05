export interface IGenericExecute<T, R> {
  execute(data: T): Promise<R>;
}
