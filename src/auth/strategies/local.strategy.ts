import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignInUseCase } from '../use_cases/sign_in.use_case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private signInUseCase: SignInUseCase;

  constructor() {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<Auth> {
    const user = await this.signInUseCase.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
