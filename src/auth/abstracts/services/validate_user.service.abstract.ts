import { Inject } from '@nestjs/common';
import { Auth } from 'src/auth/entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

export class ValidateUserServiceAbstract {
  @Inject('IFindUserByEmailHelper')
  protected readonly findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IHashUtil')
  protected readonly hashUtil: IHashUtil;
}
