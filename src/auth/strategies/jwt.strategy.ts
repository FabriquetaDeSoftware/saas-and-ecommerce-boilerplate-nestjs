import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtKeysConstants } from '../constants/jwt_keys.constants';
import { IJWTUserPayload } from '../interfaces/jwt-user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKeysConstants.secret_token_key,
    });
  }

  async validate(payload: IJWTUserPayload) {
    if (payload.type !== 'access_token') {
      throw new UnauthorizedException('Invalid token type');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
