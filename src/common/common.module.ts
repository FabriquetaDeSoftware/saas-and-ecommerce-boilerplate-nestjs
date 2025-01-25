import { Module } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [DatabaseModule],
})
export class CommonModule {}
