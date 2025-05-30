import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/databases/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleBasedAccessControlGuard } from './guards/rbac.guard';
import { SharedModule } from 'src/shared/shared.module';
import { CaslModule } from './casl/casl.module';
import { ServiceModule } from './modules/services/service.module';

@Module({
  imports: [DatabaseModule, SharedModule, CaslModule, ServiceModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleBasedAccessControlGuard,
    },
  ],
  exports: [DatabaseModule, CaslModule, ServiceModule],
})
export class CommonModule {}
