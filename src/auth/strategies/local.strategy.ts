import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
import { IGenericExecute } from '@src/shared/interfaces/generic_execute.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject('IValidateUserService')
  private validateUserService: IGenericExecute<SignInAuthDto, Auth>;

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
