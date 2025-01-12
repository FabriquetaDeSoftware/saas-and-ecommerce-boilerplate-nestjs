import { Inject } from '@nestjs/common';
import { IAuthRepository } from 'src/auth/interfaces/repository/auth.repository.interface';

export class FindUserByEmailHelperAbstract {
  @Inject('IAuthRepository')
  protected readonly authRepository: IAuthRepository;
}
