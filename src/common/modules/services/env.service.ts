import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  public get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  public get secretAccessTokenKey(): string {
    return this.configService.get<string>('SECRET_ACCESS_TOKEN_KEY');
  }

  public get secretRefreshTokenKey(): string {
    return this.configService.get<string>('SECRET_REFRESH_TOKEN_KEY');
  }

  public get secretRecoveryPasswordTokenKey(): string {
    return this.configService.get<string>('SECRET_RECOVERY_PASSWORD_TOKEN_KEY');
  }

  public get portApi(): number {
    return this.configService.get<number>('PORT_API');
  }

  public get encryptPassword(): string {
    return this.configService.get<string>('ENCRYPT_PASSWORD');
  }

  public get encryptSalt(): string {
    return this.configService.get<string>('ENCRYPT_SALT');
  }

  public get emailFrom(): string {
    return this.configService.get<string>('EMAIL_FROM');
  }

  public get emailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }

  public get emailPort(): number {
    return this.configService.get<number>('EMAIL_PORT');
  }

  public get emailUser(): string {
    return this.configService.get<string>('EMAIL_USER');
  }

  public get emailPassword(): string {
    return this.configService.get<string>('EMAIL_PASSWORD');
  }

  public get stripeSecretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY');
  }

  public get stripeWebhookSecret(): string {
    return this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  public get stripeSuccessUrl(): string {
    return this.configService.get<string>('STRIPE_SUCCESS_URL');
  }

  public get stripeCancelUrl(): string {
    return this.configService.get<string>('STRIPE_CANCEL_URL');
  }

  public get<T>(key: string): T {
    return this.configService.get<T>(key);
  }
}
