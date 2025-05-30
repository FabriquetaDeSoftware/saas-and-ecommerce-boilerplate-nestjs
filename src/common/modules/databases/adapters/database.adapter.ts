import { Global, Inject, Injectable } from '@nestjs/common';
import { IDatabaseAdapter } from '../interfaces/database.adapter.interface';
import { PrismaService } from '../modules/prisma/prisma.service';

@Global()
@Injectable()
export class DatabaseAdapter implements IDatabaseAdapter {
  @Inject()
  private readonly _prismaService: PrismaService;

  public async create<R>(
    model: string,
    data: object,
    omitFields?: Partial<Record<keyof R, true>>,
  ): Promise<Partial<R>> {
    return await this._prismaService[model].create({ omit: omitFields, data });
  }

  public async delete(model: string, where: object): Promise<void> {
    await this._prismaService[model].delete({ where });

    return;
  }

  public async findMany<R>(
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
  }> {
    const total = await this._prismaService[model].count();
    const page = skip * take;

    const result = await this._prismaService[model].findMany({
      omit: omitFields,
      where,
      skip: page,
      take,
    });

    return {
      data: result,
      total,
      page: skip + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  public async findOne<R>(
    model: string,
    where: object,
    omitFields?: Partial<Record<keyof R, true>>,
  ): Promise<Partial<R> | null> {
    return await this._prismaService[model].findUnique({
      omit: omitFields,
      where,
    });
  }

  public async update<R>(
    model: string,
    where: object,
    data: object,
    omitFields?: Partial<Record<keyof R, true>>,
  ): Promise<Partial<R>> {
    return await this._prismaService[model].update({
      omit: omitFields,
      where,
      data,
    });
  }
}
