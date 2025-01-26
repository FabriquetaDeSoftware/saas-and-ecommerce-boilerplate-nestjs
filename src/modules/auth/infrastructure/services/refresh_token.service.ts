import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { IRefreshTokenService } from '../../domain/interfaces/services/refresh_token.service.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IGenerateTokenHelper } from '../../domain/interfaces/helpers/generate_token.helper.interface';
import { RefreshTokenDto } from '../../application/dto/refresh_token.dto';
import { ITokensReturnsHelper } from '../../domain/interfaces/helpers/tokens_returns.helper.interface';
import { IJwtUserPayloadHelper } from '../../domain/interfaces/helpers/jwt_user_payload.helper.interface';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  @Inject()
  private readonly _jwtService: JwtService;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IGenerateTokenHelper')
  private readonly _generateTokenUtil: IGenerateTokenHelper;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async execute(input: RefreshTokenDto): Promise<ITokensReturnsHelper> {
    return await this.intermediary(input.refresh_token);
  }

  private async intermediary(
    refreshToken: string,
  ): Promise<ITokensReturnsHelper> {
    const payload = await this.verifyRefreshTokenIsValid(refreshToken);

    const [sub, email, role] = await Promise.all([
      this.decryptPayload(Buffer.from(payload.sub, 'base64')),
      this.decryptPayload(Buffer.from(payload.email, 'base64')),
      this.decryptPayload(Buffer.from(payload.role, 'base64')),
    ]);

    await this.checkEmailExistsOrError(email);

    const { access_token, refresh_token } =
      await this._generateTokenUtil.execute({ email, role, sub });

    return { access_token, refresh_token };
  }

  private async verifyRefreshTokenIsValid(
    refreshToken: string,
  ): Promise<IJwtUserPayloadHelper> {
    const payload: IJwtUserPayloadHelper = await this._jwtService.verify(
      refreshToken,
      {
        secret: jwtKeysConstants.secret_refresh_token_key,
      },
    );

    const payloadType = await this.decryptPayload(
      Buffer.from(payload.type, 'base64'),
    );

    if (payloadType !== TokenEnum.REFRESH_TOKEN) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return payload;
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException('Invalid Payload');
    }

    return findUserByEmail;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
