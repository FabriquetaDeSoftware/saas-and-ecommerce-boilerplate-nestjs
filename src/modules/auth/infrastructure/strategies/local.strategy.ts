import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { IValidateUserService } from '../../domain/interfaces/services/validate_user.service.interface';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
    });
  }

  @Inject('IValidateUserService')
  private _validateUserService: IValidateUserService;

  public async validate(
    email: string,
    password: string,
  ): Promise<Partial<Auth>> {
    const user = await this._validateUserService.execute({ email, password });

    if (!user || !user.is_verified_account) {
      throw new UnauthorizedException(
        'Invalid credentials or account not verified',
      );
    }

    return user;
  }
}
