import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RecoveryPasswordDto } from 'src/modules/auth/application/dto/recovery_password.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return password revovery', async () => {
    const recoveryPasswordData: RecoveryPasswordDto = {
      token: 'valid_token',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/recovery-password/')
      .send(recoveryPasswordData)
      .expect(200);

    expect(response.body).toEqual({ message: 'Password recovered' });
  });

  it('Should return 400 when token is invalid', async () => {
    const recoveryPasswordData: RecoveryPasswordDto = {
      token: 'invalid_token',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/recovery-password/')
      .send(recoveryPasswordData)
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  afterAll(async () => {
    await app.close();
  });
});
