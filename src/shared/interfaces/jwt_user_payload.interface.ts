export interface IJwtUserPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  type?: string;
}
