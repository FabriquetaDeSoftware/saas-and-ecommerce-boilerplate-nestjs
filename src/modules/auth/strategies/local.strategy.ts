import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { IValidateUserService } from '../interfaces/services/validate_user.service.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
    });
  }

  @Inject('IValidateUserService')
  private _validateUserService: IValidateUserService;

  public async validate(email: string, password: string): Promise<Auth> {
    const user = await this._validateUserService.execute({ email, password });

    if (!user || !user.is_verified_account) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return user;
  }
}
