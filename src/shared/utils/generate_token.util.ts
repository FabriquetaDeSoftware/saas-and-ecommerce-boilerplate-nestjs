import { Inject, Injectable } from '@nestjs/common';
import { GenerateTokenDto } from './dto/generate_token.dto';
import { ITokensReturns } from '../interfaces/tokens_returns.interface';
import { IJwtUserPayload } from '../interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from '../constants/jwt_keys.constants';
import { ICryptoUtil } from './interfaces/crypto.util.interface';
import { JwtService } from '@nestjs/jwt';
import { IGenerateTokenUtil } from './interfaces/generate_token.util.interface';
import { TokenEnum } from '../enum/token.enum';

@Injectable()
export class GenerateTokenUtil implements IGenerateTokenUtil {
  @Inject()
  private readonly _jwtService: JwtService;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async execute(input: GenerateTokenDto): Promise<ITokensReturns> {
    const { access_token, refresh_token, token } =
      await this.intermediry(input);

    return {
      access_token,
      refresh_token,
      token,
    };
  }

  private async intermediry(data: GenerateTokenDto): Promise<ITokensReturns> {
    const [sub, email, role] = await Promise.all([
      this.encryptPayload(data.sub),
      this.encryptPayload(data.email),
      this.encryptPayload(data.role),
    ]);

    const payload: IJwtUserPayload = {
      sub,
      email,
      role,
    };

    const { access_token, refresh_token, token } = await this.generateTokens(
      payload,
      data.type,
    );

    return { access_token, refresh_token, token };
  }

  private async generateTokens(
    payload: IJwtUserPayload,
    type?: TokenEnum,
  ): Promise<ITokensReturns> {
    if (type) {
      const typeEcripted = await this.encryptPayload(type);

      const token = this._jwtService.sign({ ...payload, type: typeEcripted });

      return { token };
    }

    const [ACCESS_TOKEN_ENUM, REFRESH_TOKEN_ENUM] = await Promise.all([
      this.encryptPayload(TokenEnum.ACCESS_TOKEN),
      this.encryptPayload(TokenEnum.REFRESH_TOKEN),
    ]);

    const [access_token, refresh_token] = [
      this._jwtService.sign({ ...payload, type: ACCESS_TOKEN_ENUM }),
      this._jwtService.sign(
        { ...payload, type: REFRESH_TOKEN_ENUM },
        { expiresIn: '7d', secret: jwtKeysConstants.secret_refresh_token_key },
      ),
    ];

    return { access_token, refresh_token };
  }

  private async encryptPayload(data: string): Promise<string> {
    const dataBuffer = await this._cryptoUtil.encryptData(data);
    const dataBase64 = dataBuffer.toString('base64');

    return dataBase64;
  }
}
