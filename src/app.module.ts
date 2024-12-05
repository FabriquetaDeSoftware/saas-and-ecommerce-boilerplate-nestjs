import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, PrismaModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
