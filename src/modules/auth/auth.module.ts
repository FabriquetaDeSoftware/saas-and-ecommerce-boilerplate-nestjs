import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './repositories/auth.repository';
import { SignInUseCase } from './use_cases/sign_in.use_case';
import { SignUpUseCase } from './use_cases/sign_up.use_case';
import { FindUserByEmailHelper } from './helpers/find_user_by_email.helper';
import { ValidateUserService } from './services/validate_user.service';
import { SharedModule } from 'src/shared/shared.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenService } from './services/refresh_token.service';
import { VerifyAccountUseCase } from './use_cases/verify_account.use_case';
import { VerificationCodesRepository } from './repositories/verification_codes.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { DatabaseModule } from 'src/databases/database.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtKeysConstants.secret_token_key,
      signOptions: { expiresIn: '30m' },
    }),
    SharedModule,
    DatabaseModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    VerificationCodesRepository,
    {
      provide: 'IVerificationCodesRepository',
      useExisting: VerificationCodesRepository,
    },
    VerifyAccountUseCase,
    {
      provide: 'IVerifyAccountUseCase',
      useExisting: VerifyAccountUseCase,
    },
    RefreshTokenService,
    {
      provide: 'IRefreshTokenService',
      useExisting: RefreshTokenService,
    },
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
    JwtStrategy,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
