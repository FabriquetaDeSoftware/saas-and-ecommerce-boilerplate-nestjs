import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtKeysConstants } from '../../shared/constants/jwt_keys.constants';
import { IJwtUserPayload } from '../../shared/interfaces/jwt_user_payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKeysConstants.secret_token_key,
    });
  }

  public async validate(payload: IJwtUserPayload): Promise<IJwtUserPayload> {
    if (payload.type !== 'access_token') {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
