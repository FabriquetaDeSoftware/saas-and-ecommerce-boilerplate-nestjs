export class OneTimePassword {
  id: number;
  public_id: string;

  password: string;

  created_at: Date;
  expires_at: Date;

  user_id: number;
}
