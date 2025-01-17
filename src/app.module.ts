import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './databases/database.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    SharedModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
