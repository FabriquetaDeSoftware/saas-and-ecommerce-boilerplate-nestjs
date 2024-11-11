import { Module } from '@nestjs/common';
import { AuthController } from '@src/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from '@src/auth/repository/auth.repository';
import { SignInWithCredentialsUseCase } from '@src/auth/use_cases/sign_in_with_credentials.use_case';
import { SignUpUseCase } from '@src/auth/use_cases/sign_up.use_case';
import { FindUserByEmailHelper } from './helpers/find_user_by_email.helper';
import { ValidateUserService } from './services/validate_user.service';
import { PrismaModule } from '@src/prisma/prisma.module';
import { SharedModule } from '@src/shared/shared.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PrismaModule, SharedModule, PassportModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LocalStrategy,
    SignUpUseCase,
    {
      provide: 'ISignUpUseCase',
      useExisting: SignUpUseCase,
    },
    SignInWithCredentialsUseCase,
    {
      provide: 'ISignInWithCredentialsUseCase',
      useExisting: SignInWithCredentialsUseCase,
    },
    AuthRepository,
    {
      provide: 'IAuthRepository',
      useExisting: AuthRepository,
    },
    FindUserByEmailHelper,
    {
      provide: 'IFindUserByEmailHelper',
      useExisting: FindUserByEmailHelper,
    },
    ValidateUserService,
    {
      provide: 'IValidateUserService',
      useExisting: ValidateUserService,
    },
  ],
})
export class AuthModule {}
