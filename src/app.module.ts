import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './databases/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' }),
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
