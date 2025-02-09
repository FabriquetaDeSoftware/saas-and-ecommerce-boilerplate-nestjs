import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './common/databases/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './shared/modules/email/email.module';
import { CommonModule } from './common/common.module';
import { BillingModule } from './modules/billing/billing.module';
import { CaslModule } from './common/casl/casl.module';
import { ProductsModule } from './modules/products/products.module';
import { AppController } from './app.controller';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
