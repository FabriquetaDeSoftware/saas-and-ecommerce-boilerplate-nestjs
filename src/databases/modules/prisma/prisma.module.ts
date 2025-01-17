import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseAdapter } from '../../adapters/database.adapter';

@Module({
  providers: [
    PrismaService,
    DatabaseAdapter,
    {
      provide: 'IDatabaseAdapter',
      useExisting: DatabaseAdapter,
    },
  ],
  exports: ['IDatabaseAdapter'],
})
export class PrismaModule {}
