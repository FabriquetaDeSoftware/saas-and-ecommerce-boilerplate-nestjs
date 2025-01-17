import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { EmailModule } from './shared/modules/email/email.module';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [AuthModule, SharedModule, DatabaseModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
