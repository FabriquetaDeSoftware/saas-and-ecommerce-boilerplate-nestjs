export class VerificationCodes {
  id: number;
  public_id: string;

  code: string;

  created_at: Date;
  expires_at: Date;

  auth_id: number;
}
