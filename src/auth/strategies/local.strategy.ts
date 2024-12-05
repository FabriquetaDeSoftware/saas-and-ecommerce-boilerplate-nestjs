import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IValidateUserService } from '../interfaces/services/validate_user.service.interface';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject('IValidateUserService')
  private validateUserService: IValidateUserService;

  constructor() {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<Auth> {
    const user = await this.validateUserService.execute({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
