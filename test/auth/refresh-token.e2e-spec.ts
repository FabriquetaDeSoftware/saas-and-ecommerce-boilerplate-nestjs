import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RefreshTokenDto } from 'src/modules/auth/application/dto/refresh_token.dto';

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

  it('Should return new authetication payload', async () => {
    const refreshTokenData: RefreshTokenDto = {
      refresh_token: 'valid_refresh_token',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token/')
      .send(refreshTokenData)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('Should return 400 when token is invalid', async () => {
    const refreshTokenData: RefreshTokenDto = {
      refresh_token: 'invalid_refresh_token',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token/')
      .send(refreshTokenData)
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  afterAll(async () => {
    await app.close();
  });
});
