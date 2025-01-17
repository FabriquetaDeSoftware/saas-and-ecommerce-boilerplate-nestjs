import { Global, Inject, Injectable } from '@nestjs/common';
import { IDatabase } from 'src/databases/interfaces/database.interface';
import { PrismaService } from '../modules/prisma/prisma.service';

@Global()
@Injectable()
export class DatabaseAdapter implements IDatabase {
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
