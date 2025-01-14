import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
    });
  }

  @Inject('IValidateUserService')
  private validateUserService: IGenericExecute<SignInAuthDto, Auth>;

  public async validate(email: string, password: string): Promise<Auth> {
    const user = await this.validateUserService.execute({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
