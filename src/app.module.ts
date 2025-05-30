import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './common/modules/databases/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './shared/modules/email/email.module';
import { CommonModule } from './common/common.module';
import { BillingModule } from './modules/billing/billing.module';
import { CaslModule } from './common/casl/casl.module';
import { ProductsModule } from './modules/products/products.module';
import { AppController } from './app.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './modules/user/user.module';
import { ServiceModule } from './common/modules/services/service.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/app/metrics',
    }),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    SharedModule,
    DatabaseModule,
    EmailModule,
    CommonModule,
    BillingModule,
    CaslModule,
    ProductsModule,
    UserModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
