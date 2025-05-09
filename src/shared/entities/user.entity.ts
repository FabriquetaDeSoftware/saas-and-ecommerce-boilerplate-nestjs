import { RolesEnum } from 'src/shared/enum/roles.enum';

export class User {
  id: number;
  public_id: string;

  role: RolesEnum;
  name: string;
  email: string;
  password: string;

  is_verified_account: boolean;
  newsletter_subscription: boolean;
  terms_and_conditions_accepted: boolean;

  created_at: Date;
  updated_at: Date;
}
