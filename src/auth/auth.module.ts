import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './repository/auth.repository';
import { SignInUseCase } from './use_cases/sign_in.use_case';
import { SignUpUseCase } from './use_cases/sign_up.use_case';
import { FindUserByEmailHelper } from './helpers/find_user_by_email.helper';
import { ValidateUserService } from './services/validate_user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenService } from './services/refresh_token.service';
import { FindUserByEmailHelperAbstract } from './abstracts/helpers/find_user_by_email.helper.abstract';
import { AuthControllerAbstract } from './abstracts/controller/auth.controller.abstract';
import { AuthRepositoryAbstract } from './abstracts/repository/auth.repository.abstract';
import { RefreshTokenServiceAbstract } from './abstracts/services/refresh_token.service.abstract';
import { ValidateUserServiceAbstract } from './abstracts/services/validate_user.service.abstract';
import { LocalStrategyAbstract } from './abstracts/strategies/local.strategy.abstract';
import { SignInUseCaseAbstract } from './abstracts/use_cases/sign_in.use_case.abstract';
import { SignUpUseCaseAbstract } from './abstracts/use_cases/sign_up.use_case.abstract';

@Module({
  imports: [PrismaModule, SharedModule, PassportModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LocalStrategy,
    FindUserByEmailHelperAbstract,
    AuthControllerAbstract,
    AuthRepositoryAbstract,
    RefreshTokenServiceAbstract,
    ValidateUserServiceAbstract,
    LocalStrategyAbstract,
    SignInUseCaseAbstract,
    SignUpUseCaseAbstract,
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
  ],
})
export class AuthModule {}
