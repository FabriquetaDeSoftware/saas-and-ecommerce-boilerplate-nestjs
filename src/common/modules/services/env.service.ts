import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get secretAccessTokenKey(): string {
    return this.configService.get<string>('SECRET_ACCESS_TOKEN_KEY');
  }

  get secretRefreshTokenKey(): string {
    return this.configService.get<string>('SECRET_REFRESH_TOKEN_KEY');
  }

  get secretRecoveryPasswordTokenKey(): string {
    return this.configService.get<string>('SECRET_RECOVERY_PASSWORD_TOKEN_KEY');
  }

  get portApi(): number {
    return this.configService.get<number>('PORT_API');
  }

  get encryptPassword(): string {
    return this.configService.get<string>('ENCRYPT_PASSWORD');
  }

  get encryptSalt(): string {
    return this.configService.get<string>('ENCRYPT_SALT');
  }

  get emailFrom(): string {
    return this.configService.get<string>('EMAIL_FROM');
  }

  get emailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }

  get emailPort(): number {
    return this.configService.get<number>('EMAIL_PORT');
  }

  get emailUser(): string {
    return this.configService.get<string>('EMAIL_USER');
  }

  get emailPassword(): string {
    return this.configService.get<string>('EMAIL_PASSWORD');
  }

  get stripeSecretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY');
  }

  get stripeWebhookSecret(): string {
    return this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  get stripeSuccessUrl(): string {
    return this.configService.get<string>('STRIPE_SUCCESS_URL');
  }

  get stripeCancelUrl(): string {
    return this.configService.get<string>('STRIPE_CANCEL_URL');
  }

  public get(key: string): string {
    return this.configService.get<string>(key);
  }
}
