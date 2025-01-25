import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './repositories/auth.repository';
import { SignInDefaultUseCase } from './use_cases/sign_in_default.use_case';
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
import { EmailModule } from 'src/shared/modules/email/email.module';
import { ForgotPasswordService } from './services/forgot_password.service';
import { RecoveryPasswordUseCase } from './use_cases/recovery_password.use_case';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtKeysConstants.secret_access_token_key,
      signOptions: { expiresIn: '30m' },
    }),
    SharedModule,
    DatabaseModule,
    PassportModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    ForgotPasswordService,
    {
      provide: 'IForgotPasswordService',
      useExisting: ForgotPasswordService,
    },
    RecoveryPasswordUseCase,
    {
      provide: 'IRecoveryPasswordUseCase',
      useExisting: RecoveryPasswordUseCase,
    },
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
    SignInDefaultUseCase,
    {
      provide: 'ISignInDefaultUseCase',
      useExisting: SignInDefaultUseCase,
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
