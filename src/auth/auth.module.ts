import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from './constants/jwt_keys.constants';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthRepository } from './repository/auth.repository';
import { SignInUseCase } from './use_cases/sign_in.use_case';
import { SignUpUseCase } from './use_cases/sign_up.use_case';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtKeysConstants.secret_token_key,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'ISignUpUseCase',
      useExisting: SignUpUseCase,
    },
    {
      provide: 'ISignInUseCase',
      useExisting: SignInUseCase,
    },
    {
      provide: 'IAuthRepository',
      useExisting: AuthRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
