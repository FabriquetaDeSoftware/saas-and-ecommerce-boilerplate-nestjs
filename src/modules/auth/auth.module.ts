import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './interface/controllers/auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ForgotPasswordService } from './infrastructure/services/forgot_password.service';
import { RecoveryPasswordUseCase } from './application/use_cases/recovery_password.use_case';
import { VerificationCodesRepository } from './infrastructure/repositories/verification_codes.repository';
import { VerifyAccountUseCase } from './application/use_cases/verify_account.use_case';
import { RefreshTokenService } from './infrastructure/services/refresh_token.service';
import { SignUpDefaultUseCase } from './application/use_cases/sign_up_default.use_case';
import { SignInDefaultUseCase } from './application/use_cases/sign_in_default.use_case';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { FindUserByEmailHelper } from './shared/helpers/find_user_by_email.helper';
import { ValidateUserService } from './infrastructure/services/validate_user.service';
import { GenerateTokenHelper } from './shared/helpers/generate_token.helper';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtAuthGuard } from './interface/guards/jwt_auth.guard';
import { SignInMagicLinkUseCase } from './application/use_cases/sign_in_magic_link.use_case';
import { SignUpPasswordLessUseCase } from './application/use_cases/sign_up_password_less.use_case';
import { EnvService } from 'src/common/modules/services/env.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CommonModule],
      inject: [EnvService],
      useFactory: (envServide: EnvService) => ({
        secret: envServide.secretAccessTokenKey,
        signOptions: { expiresIn: '30m' },
      }),
    }),
    SharedModule,
    CommonModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    SignUpPasswordLessUseCase,
    {
      provide: 'ISignUpPasswordLessUseCase',
      useExisting: SignUpPasswordLessUseCase,
    },
    SignInMagicLinkUseCase,
    {
      provide: 'ISignInMagicLinkUseCase',
      useExisting: SignInMagicLinkUseCase,
    },
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
    SignUpDefaultUseCase,
    {
      provide: 'ISignUpDefaultUseCase',
      useExisting: SignUpDefaultUseCase,
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
