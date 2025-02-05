import { SetMetadata } from '@nestjs/common';
import { RBACEnum } from 'src/shared/enum/rbac.enum';

export const RBAC_KEY = 'roles';
export const RBAC = (...roles: RBACEnum[]) => SetMetadata(RBAC_KEY, roles);
