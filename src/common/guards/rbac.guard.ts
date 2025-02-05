import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

@Injectable()
export class RoleBasedAccessControlGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  @Inject('ICryptoUtil')
  protected readonly cryptoUtil: ICryptoUtil;

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const role = await this.intermediry(user.role);

    return requiredRoles.some((requiredRole) => requiredRole === role);
  }

  private async intermediry(data: string): Promise<string> {
    const dataDecoded = await this.decryptPayload(data);

    return dataDecoded;
  }

  private async decryptPayload(data: string): Promise<string> {
    const dataFromBase64ToBuffer = Buffer.from(data, 'base64');

    const dataBuffer = await this.cryptoUtil.decryptData(
      dataFromBase64ToBuffer,
    );

    const dataDecoded = dataBuffer.toString();

    return dataDecoded;
  }
}
