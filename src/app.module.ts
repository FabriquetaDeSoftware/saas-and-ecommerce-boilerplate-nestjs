import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, SharedModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
