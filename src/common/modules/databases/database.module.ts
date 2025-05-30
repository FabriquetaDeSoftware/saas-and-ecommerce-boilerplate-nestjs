import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DatabaseAdapter } from './adapters/database.adapter';

@Module({
  imports: [PrismaModule],
  providers: [
    DatabaseAdapter,
    {
      provide: 'IDatabaseAdapter',
      useExisting: DatabaseAdapter,
    },
  ],
  exports: ['IDatabaseAdapter'],
})
export class DatabaseModule {}
