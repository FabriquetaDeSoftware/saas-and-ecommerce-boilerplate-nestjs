import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RolesEnum } from '../enum/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { ICryptoUtil } from '../utils/interfaces/crypto.util.interface';

@Injectable()
export class RolesGuard implements CanActivate {
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
    const dataFromBase64ToBuffer = Buffer.from(data, 'base64');

    const dataDecoded = await this.decryptPayload(dataFromBase64ToBuffer);

    return dataDecoded;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this.cryptoUtil.decryptData(data);
    const dataDecoded = dataBuffer.toString();

    return dataDecoded;
  }
}
