import { SetMetadata } from '@nestjs/common';
import { RolesAuth } from '../enum/roles_auth.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesAuth[]) => SetMetadata(ROLES_KEY, roles);
