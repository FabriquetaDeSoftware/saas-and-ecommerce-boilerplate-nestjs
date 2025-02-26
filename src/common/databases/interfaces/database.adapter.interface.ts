export interface IDatabaseAdapter {
  findOne<R>(model: string, where: object): Promise<R | null>;

  findMany<R>(
    model: string,
    where?: object,
    skip?: number,
    take?: number,
    omitFields?: Partial<Record<keyof R, true>>,
  ): Promise<{
    data: Partial<R[]>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  create<R>(model: string, data: object): Promise<R>;

  update<R>(model: string, where: object, data: object): Promise<R>;

  delete<R>(model: string, where: object): Promise<R>;
}
