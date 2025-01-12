import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { LocalStrategyAbstract } from '../abstracts/strategies/local.strategy.abstract';

@Injectable()
export class LocalStrategy extends LocalStrategyAbstract {
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
