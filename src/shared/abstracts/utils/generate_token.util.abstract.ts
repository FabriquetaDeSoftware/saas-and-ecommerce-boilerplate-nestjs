import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

export class GenerateTokenUtilAbstract {
  @Inject()
  protected readonly jwtService: JwtService;

  @Inject('ICryptoUtil')
  protected readonly cryptoUtil: ICryptoUtil;
}
