import { Injectable } from '@nestjs/common';
import { IPermissionManagerUtil } from './interfaces/permission_manager.util.interface';

@Injectable()
export class PermissionManagerUtil implements IPermissionManagerUtil {
  public initializeCaslAbility() {}

  public validateFieldPermissions() {}

  public filterAllowedFields() {}
}
