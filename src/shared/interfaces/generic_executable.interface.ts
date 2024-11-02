export interface IGenericExecutable<Input, Output> {
  execute(input: Input): Promise<Output>;
}
