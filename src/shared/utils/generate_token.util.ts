import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenUtilDto } from './dto/generate_token_util.dto';
import { ITokensReturns } from '../interfaces/tokens_returns.interface';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from '../interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';
import { ICryptoUtil } from './interfaces/crypto.util.interface';
import { IGenericExecute } from '../interfaces/generic_execute.interface';

@Injectable()
export class GenerateTokenUtil
  implements IGenericExecute<GenerateTokenUtilDto, ITokensReturns>
{
  @Inject()
  private readonly jwtService: JwtService;

  @Inject('ICryptoUtil')
  private readonly cryptoUtil: ICryptoUtil;

  public async execute(input: GenerateTokenUtilDto): Promise<ITokensReturns> {
    const { sub, email, role } = await this.intermediry(input);

    const payload: IJwtUserPayload = {
      sub,
      email,
      role,
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

  private async intermediry(
    data: GenerateTokenUtilDto,
  ): Promise<IJwtUserPayload> {
    const [sub, email, role] = await Promise.all([
      this.encryptPayload(data.sub),
      this.encryptPayload(data.email),
      this.encryptPayload(data.role),
    ]);

    return { sub, email, role };
  }

  private async encryptPayload(data: string): Promise<string> {
    const dataBuffer = await this.cryptoUtil.encryptData(data);
    const dataBase64 = dataBuffer.toString('base64');

    return dataBase64;
  }
}
