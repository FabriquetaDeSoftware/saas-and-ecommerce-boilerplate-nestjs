import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { IJwtUserPayload } from '../../../../shared/interfaces/jwt_user_payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKeysConstants.secret_access_token_key,
    });
  }

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async validate(payload: IJwtUserPayload): Promise<IJwtUserPayload> {
    const payloadType = await this.decryptPayload(
      Buffer.from(payload.type, 'base64'),
    );

    if (payloadType !== TokenEnum.ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
