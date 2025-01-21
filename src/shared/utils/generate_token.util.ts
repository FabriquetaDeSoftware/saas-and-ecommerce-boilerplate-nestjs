import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenDto } from './dto/generate_token.dto';
import { ITokensReturns } from '../interfaces/tokens_returns.interface';
import { IJwtUserPayload } from '../interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from '../constants/jwt_keys.constants';
import { IGenericExecute } from '../interfaces/generic_execute.interface';
import { ICryptoUtil } from './interfaces/crypto.util.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenUtil
  implements IGenericExecute<GenerateTokenDto, ITokensReturns>
{
  @Inject()
  private readonly _jwtService: JwtService;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async execute(input: GenerateTokenDto): Promise<ITokensReturns> {
    const { sub, email, role } = await this.intermediry(input);

    const payload: IJwtUserPayload = {
      sub,
      email,
      role,
    };

    const [access_token, refresh_token] = [
      this._jwtService.sign({ ...payload, type: 'access_token' }),
      this._jwtService.sign(
        { ...payload, type: 'refresh_token' },
        { expiresIn: '7d', secret: jwtKeysConstants.secret_refresh_token_key },
      ),
    ];

    return {
      access_token,
      refresh_token,
    };
  }

  private async intermediry(data: GenerateTokenDto): Promise<IJwtUserPayload> {
    const [sub, email, role] = await Promise.all([
      this.encryptPayload(data.sub),
      this.encryptPayload(data.email),
      this.encryptPayload(data.role),
    ]);

    return { sub, email, role };
  }

  private async encryptPayload(data: string): Promise<string> {
    const dataBuffer = await this._cryptoUtil.encryptData(data);
    const dataBase64 = dataBuffer.toString('base64');

    return dataBase64;
  }
}
