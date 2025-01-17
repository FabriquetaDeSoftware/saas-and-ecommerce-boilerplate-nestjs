export interface IDatabase {
  findOne<R>(model: string, where: object): Promise<R | null>;
  findMany<R>(model: string, where?: object): Promise<R[]>;
  create<R>(model: string, data: object): Promise<R>;
  update<R>(model: string, where: object, data: object): Promise<R>;
  delete<R>(model: string, where: object): Promise<R>;
}
