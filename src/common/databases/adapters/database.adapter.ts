import { Global, Inject, Injectable } from '@nestjs/common';
import { IDatabaseAdapter } from '../interfaces/database.adapter.interface';
import { PrismaService } from '../modules/prisma/prisma.service';

@Global()
@Injectable()
export class DatabaseAdapter implements IDatabaseAdapter {
  @Inject()
  private readonly _prismaService: PrismaService;

  public async create<R>(model: string, data: object): Promise<R> {
    return await this._prismaService[model].create({ data });
  }

  public async delete<R>(model: string, where: object): Promise<R> {
    return await this._prismaService[model].delete({ where });
  }

  public async findMany<R>(model: string, where?: object): Promise<R[]> {
    return await this._prismaService[model].findMany({ where });
  }

  public async findManyWithPagination<R>(
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
  }> {
    const total = await this._prismaService[model].count();
    const page = skip * take;
    const result = await this._prismaService[model].findMany({
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

  public async findOne<R>(model: string, where: object): Promise<R | null> {
    return await this._prismaService[model].findUnique({ where });
  }

  public async update<R>(
    model: string,
    where: object,
    data: object,
  ): Promise<R> {
    return await this._prismaService[model].update({ where, data });
  }
}
