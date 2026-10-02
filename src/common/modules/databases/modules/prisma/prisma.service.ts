import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const schema =
      new URL(connectionString).searchParams.get('schema') ?? undefined;
    super({ adapter: new PrismaPg({ connectionString }, { schema }) });
  }

  public async onModuleInit() {
    await this.$connect();
  }
}
