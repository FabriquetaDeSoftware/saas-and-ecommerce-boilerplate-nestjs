import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokensReturns } from 'src/shared/interfaces/tokens_returns.interface';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { Auth } from '../entities/auth.entity';
import { RefreshTokenDto } from '../dto/refresh_token.dto';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { RefreshTokenServiceAbstract } from '../abstracts/services/refresh_token.service.abstract';

@Injectable()
export class RefreshTokenService
  extends RefreshTokenServiceAbstract
  implements IGenericExecute<RefreshTokenDto, ITokensReturns>
{
  public async execute(input: RefreshTokenDto): Promise<ITokensReturns> {
    return await this.intermediary(input.refresh_token);
  }

  private async intermediary(refreshToken: string): Promise<ITokensReturns> {
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
  ): Promise<IJwtUserPayload> {
    const payload: IJwtUserPayload = await this._jwtService.verify(
      refreshToken,
      {
        secret: jwtKeysConstants.secret_refresh_token_key,
      },
    );

    if (payload.type !== 'refresh_token') {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  private async checkEmailExistsOrError(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      return null;
    }

    return findUserByEmail;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
