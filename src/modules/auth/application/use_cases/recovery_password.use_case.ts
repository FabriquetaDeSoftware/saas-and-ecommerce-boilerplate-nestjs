import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RecoveryPasswordDto } from '../dto/recovery_password.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IRecoveryPasswordUseCase } from '../../domain/interfaces/use_cases/recovery_password.use_case.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IJwtUserPayloadHelper } from '../../domain/interfaces/helpers/jwt_user_payload.helper.interface';
import { Auth } from '../../domain/entities/auth.entity';

@Injectable()
export class RecoveryPasswordUseCase implements IRecoveryPasswordUseCase {
  @Inject()
  private readonly _jwtService: JwtService;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  private readonly _findUserByEmailHelper: IFindUserByEmailHelper;

  @Inject('IHashUtil')
  private readonly _hashUtil: IHashUtil;

  public async execute(
    input: RecoveryPasswordDto,
  ): Promise<{ message: string }> {
    return await this.intermediary(input);
  }

  private async intermediary(
    input: RecoveryPasswordDto,
  ): Promise<{ message: string }> {
    const payload = await this.verifyRefreshTokenIsValid(input.token);

    const email = await this.decryptPayload(
      Buffer.from(payload.email, 'base64'),
    );

    const findUserByEmail = await this.findUserByEmailAndValidate(email);

    const hashedPassword = await this._hashUtil.generateHash(input.password);

    await this._authRepository.updateInfoAuth({
      id: findUserByEmail.id,
      password: hashedPassword,
    });

    return { message: 'Password recovered successfully' };
  }

  private async findUserByEmailAndValidate(email: string): Promise<Auth> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new NotFoundException('User not found');
    }

    return findUserByEmail;
  }

  private async verifyRefreshTokenIsValid(
    token: string,
  ): Promise<IJwtUserPayloadHelper> {
    const payload: IJwtUserPayloadHelper = await this._jwtService.verify(
      token,
      {
        secret: jwtKeysConstants.secret_recovery_password_token_key,
      },
    );

    const payloadType = await this.decryptPayload(
      Buffer.from(payload.type, 'base64'),
    );

    if (payloadType !== TokenEnum.RECOVERY_PASSWORD_TOKEN) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return payload;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
