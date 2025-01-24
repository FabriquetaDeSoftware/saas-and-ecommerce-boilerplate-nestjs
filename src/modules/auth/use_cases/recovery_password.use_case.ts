import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IRecoveryPasswordUseCase } from '../interfaces/use_cases/recovery_password.use_case.interface';
import { RecoveryPasswordDto } from '../dto/recovery_password.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Auth } from '../entities/auth.entity';
import { WhereRepositoryEnum } from 'src/shared/enum/where_repository.enum';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

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
  ): Promise<IJwtUserPayload> {
    const payload: IJwtUserPayload = await this._jwtService.verify(token, {
      secret: jwtKeysConstants.secret_token_key,
    });

    const payloadType = await this.decryptPayload(
      Buffer.from(payload.type, 'base64'),
    );

    if (payloadType !== TokenEnum.RECOVERY_PASSWORD_TOKEN) {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
