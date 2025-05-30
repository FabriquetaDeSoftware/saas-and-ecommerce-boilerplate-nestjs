import { Global, Inject, Injectable } from '@nestjs/common';
import { IDatabaseAdapter } from '../interfaces/database.adapter.interface';
import { PrismaService } from '../modules/prisma/prisma.service';

/*
TODO: add omit parameter to all methods with the type Partial<Record<keyof R, true>> to omit fields from the response. The paramter should be optional.

EXAMPLE:     
  method<R>(omitFields?: Partial<Record<keyof R, true>>): Promise<Partial<R>> {
    return await this._prismaService[model].method({ omit: omitFields });
  }

REQUIRES:
  refactoring all repository methods to use the omit parameter, and update to return partial types.
  update all tests which use the repository methods to include the omit parameter.
*/

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
