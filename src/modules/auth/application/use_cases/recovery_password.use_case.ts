import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PasswordDto } from '../dto/password.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IRecoveryPasswordUseCase } from '../../domain/interfaces/use_cases/recovery_password.use_case.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IJwtUserPayload } from '../../../../shared/interfaces/jwt_user_payload.interface';
import { User } from 'src/shared/entities/user.entity';
import { EnvService } from 'src/common/modules/services/env.service';

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

  @Inject()
  private readonly _envService: EnvService;

  public async execute(
    token: string,
    input: PasswordDto,
  ): Promise<{ message: string }> {
    return await this.intermediary(token, input.password);
  }

  private async intermediary(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    const payload = await this.verifyRefreshTokenIsValid(token);

    const email = await this.decryptPayload(
      Buffer.from(payload.email, 'base64'),
    );

    await this.findUserByEmailAndValidate(email);

    const hashedPassword = await this._hashUtil.generateHash(password);

    await this._authRepository.updateInfoByEmailAuth(email, {
      password: hashedPassword,
    });

    return { message: 'Password recovered successfully' };
  }

  private async findUserByEmailAndValidate(
    email: string,
  ): Promise<Partial<User>> {
    const findUserByEmail = await this._findUserByEmailHelper.execute(email);

    if (!findUserByEmail) {
      throw new NotFoundException('User not found');
    }

    return findUserByEmail;
  }

  private async verifyRefreshTokenIsValid(
    token: string,
  ): Promise<IJwtUserPayload> {
    const payload: IJwtUserPayload = await this._jwtService.verify(token, {
      secret: this._envService.secretRefreshTokenKey,
    });

    const payloadType = await this.decryptPayload(
      Buffer.from(payload.type, 'base64'),
    );

    if (payloadType !== TokenEnum.RECOVERY_PASSWORD_TOKEN) {
      throw new BadRequestException('Invalid or expired token');
    }

    return payload;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
