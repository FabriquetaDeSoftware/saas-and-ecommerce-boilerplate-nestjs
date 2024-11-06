import { Module } from '@nestjs/common';
import { AuthController } from '@src/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';
import { JwtAuthGuard } from '@src/auth/guards/jwt_auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthRepository } from '@src/auth/repository/auth.repository';
import { SignInUseCase } from '@src/auth/use_cases/sign_in.use_case';
import { SignUpUseCase } from '@src/auth/use_cases/sign_up.use_case';
import { FindUserByEmailHelper } from './helpers/find_user_by_email.helper';
import { ValidateUserService } from './services/validate_user.service';
import { PrismaModule } from '@src/prisma/prisma.module';
import { SharedModule } from '@src/shared/shared.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    PassportModule,
    JwtModule.register({
      secret: jwtKeysConstants.secret_token_key,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    SignUpUseCase,
    {
      provide: 'ISignUpUseCase',
      useExisting: SignUpUseCase,
    },
    SignInUseCase,
    {
      provide: 'ISignInUseCase',
      useExisting: SignInUseCase,
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
