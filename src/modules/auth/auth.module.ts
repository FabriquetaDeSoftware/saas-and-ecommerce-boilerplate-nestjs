import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from 'src/shared/modules/email/email.module';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './interface/controllers/auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ForgotPasswordService } from './infrastructure/services/forgot_password.service';
import { RecoveryPasswordUseCase } from './application/use_cases/recovery_password.use_case';
import { VerificationCodesRepository } from './infrastructure/repositories/verification_codes.repository';
import { VerifyAccountUseCase } from './application/use_cases/verify_account.use_case';
import { RefreshTokenService } from './infrastructure/services/refresh_token.service';
import { SignUpUseCase } from './application/use_cases/sign_up.use_case';
import { SignInDefaultUseCase } from './application/use_cases/sign_in_default.use_case';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { FindUserByEmailHelper } from './shared/helpers/find_user_by_email.helper';
import { ValidateUserService } from './infrastructure/services/validate_user.service';
import { GenerateTokenHelper } from './shared/helpers/generate_token.helper';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtAuthGuard } from './interface/guards/jwt_auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtKeysConstants.secret_access_token_key,
      signOptions: { expiresIn: '30m' },
    }),
    SharedModule,
    CommonModule,
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
    GenerateTokenHelper,
    {
      provide: 'IGenerateTokenHelper',
      useExisting: GenerateTokenHelper,
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
