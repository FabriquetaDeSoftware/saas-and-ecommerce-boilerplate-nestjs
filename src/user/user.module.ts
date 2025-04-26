import { Module } from '@nestjs/common';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [],
  providers: [
    UserRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
