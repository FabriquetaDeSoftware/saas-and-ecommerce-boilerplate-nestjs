import { RolesAuth } from '../../shared/enum/roles_auth.enum';

export class Auth {
  id: number;
  public_id: string;
  email: string;
  password: string;
  role: RolesAuth;

  created_at: Date;
  updated_at: Date;
}
