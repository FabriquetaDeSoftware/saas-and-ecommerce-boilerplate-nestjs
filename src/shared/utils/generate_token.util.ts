import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenUtilDto } from './dto/generate_token_util.dto';
import { ITokensReturns } from '../interfaces/tokens_returns.interface';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from '../interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';
import { IGenerateTokenUtil } from './interfaces/generate_token.util.interface';
import { ICryptoUtil } from './interfaces/crypto.util.interface';

@Injectable()
export class GenerateTokenUtil implements IGenerateTokenUtil {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject('ICryptoUtil')
  private readonly cryptoUtil: ICryptoUtil;

  public async execute(input: GenerateTokenUtilDto): Promise<ITokensReturns> {
    const [subBuffer, emailBuffer] = await Promise.all([
      this.encryptPayload(input.sub),
      this.encryptPayload(input.email),
    ]);

    const [subBase64, emailBase64] = [
      subBuffer.toString('base64'),
      emailBuffer.toString('base64'),
    ];

    const payload: IJwtUserPayload = {
      sub: subBase64,
      email: emailBase64,
      role: input.role,
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

  public async encryptPayload(data: string): Promise<Buffer> {
    return await this.cryptoUtil.encryptData(data);
  }
}
