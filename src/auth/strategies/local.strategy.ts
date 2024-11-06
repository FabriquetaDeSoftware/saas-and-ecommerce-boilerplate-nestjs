import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '@src/auth/entities/auth.entity';
import { ISignInUseCase } from '../interfaces/use_cases/sign_in.use_case.interface';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
import { ITokensReturns } from '@src/shared/interfaces/tokens_returns.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject('IValidateUserService')
  private validateUserService: ISignInUseCase;

  constructor() {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<ITokensReturns> {
    const user = await this.validateUserService.execute({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
