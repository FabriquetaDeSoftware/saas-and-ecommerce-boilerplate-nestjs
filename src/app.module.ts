import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './shared/modules/email/email.module';

@Module({
  imports: [AuthModule, SharedModule, PrismaModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
