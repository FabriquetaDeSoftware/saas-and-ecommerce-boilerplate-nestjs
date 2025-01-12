import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RolesAuth } from '../enum/roles_auth.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuardAbstract } from '../abstracts/guards/roles.guard.abstract';

@Injectable()
export class RolesGuard extends RolesGuardAbstract implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesAuth[]>(
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
