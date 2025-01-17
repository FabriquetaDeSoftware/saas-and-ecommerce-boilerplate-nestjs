import { RolesAuth } from 'src/shared/enum/roles_auth.enum';

export class Auth {
  id: number;
  public_id: string;

  role: RolesAuth;
  email: string;
  password: string;

  is_verified_account: boolean;
  newsletter_subscription: boolean;
  terms_and_conditions_accepted: boolean;

  created_at: Date;
  updated_at: Date;
}
