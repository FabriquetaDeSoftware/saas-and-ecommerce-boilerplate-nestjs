import { Injectable } from '@nestjs/common';
import { SignInAuthDto } from '../dto/sign_in_auth.dto';
import { Auth } from '../entities/auth.entity';
import { IGenericExecutable } from '@src/shared/interfaces/generic_executable.interface';

@Injectable()
export class ValidateUserService
  implements IGenericExecutable<SignInAuthDto, Auth>
{
  public async execute(input: SignInAuthDto): Promise<Auth> {
    return await this.intermediary(input);
  }

  private async intermediary(data: SignUpAuthDto): Promise<Auth> {}
}
