import { Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IGenericExecute } from '../../shared/interfaces/generic_execute.interface';
import { FindUserByEmailHelperAbstract } from '../abstracts/helpers/find_user_by_email.helper.abstract';

@Injectable()
export class FindUserByEmailHelper
  extends FindUserByEmailHelperAbstract
  implements IGenericExecute<string, Auth | void>
{
  public async execute(input: string): Promise<Auth | void> {
    const findUserByEmail = await this.authRepository.findOneByEmail(input);

    return findUserByEmail;
  }
}
