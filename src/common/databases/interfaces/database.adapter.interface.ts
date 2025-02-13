export interface IDatabaseAdapter {
  findOne<R>(model: string, where: object): Promise<R | null>;
  findMany<R>(model: string, where?: object): Promise<R[]>;
  findManyWithPagination<R>(
    model: string,
    where?: object,
    skip?: number,
    take?: number,
  ): Promise<{
    data: R[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  create<R>(model: string, data: object): Promise<R>;
  update<R>(model: string, where: object, data: object): Promise<R>;
  delete<R>(model: string, where: object): Promise<R>;
}
