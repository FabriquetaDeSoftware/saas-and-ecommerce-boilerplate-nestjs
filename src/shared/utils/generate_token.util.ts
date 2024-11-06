import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenUtilDto } from './dto/generate_token_util.dto';
import { ITokensReturns } from '../interfaces/tokens_returns.interface';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from '../interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';
import { IGenerateTokenUtil } from './interfaces/generate_token.util.interface';

@Injectable()
export class GenerateTokenUtil implements IGenerateTokenUtil {
  @Inject()
  private jwtService: JwtService;

  async execute(input: GenerateTokenUtilDto): Promise<ITokensReturns> {
    const payload: IJwtUserPayload = {
      sub: input.sub,
      email: input.email,
    };

    const [access_token, refresh_token] = [
      this.jwtService.sign({ ...payload, type: 'access_token' }),
      this.jwtService.sign(
        { ...payload, type: 'refresh_token' },
        { expiresIn: '7d', secret: jwtKeysConstants.secret_refresh_token_key },
      ),
    ];

    return {
      access_token,
      refresh_token,
    };
  }
}
