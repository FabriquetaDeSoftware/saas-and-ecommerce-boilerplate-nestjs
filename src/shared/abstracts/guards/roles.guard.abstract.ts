import { Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

export class RolesGuardAbstract {
  constructor(protected reflector: Reflector) {}

  @Inject('ICryptoUtil')
  protected readonly cryptoUtil: ICryptoUtil;
}
