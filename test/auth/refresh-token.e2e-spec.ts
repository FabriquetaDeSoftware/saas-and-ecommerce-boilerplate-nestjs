import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RefreshTokenDto } from 'src/modules/auth/application/dto/refresh_token.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    jwtServiceMock = {
      verify: jest
        .fn()
        .mockImplementation((token: string): Promise<IJwtUserPayload> => {
          if (token === 'valid_token') {
            return Promise.resolve({
              email: Buffer.from('test@example.com').toString('base64'),
              role: 'user',
              sub: '123',
              type: Buffer.from(TokenEnum.REFRESH_TOKEN).toString('base64'),
            });
          } else {
            throw new BadRequestException('Invalid or expired token');
          }
        }),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('Should return new authetication payload', async () => {
  //   const refreshTokenData: RefreshTokenDto = {
  //     refresh_token: 'valid_refresh_token',
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post('/auth/refresh-token/')
  //     .send(refreshTokenData)
  //     .expect(200);

  //   expect(response.body).toHaveProperty('access_token');
  //   expect(response.body).toHaveProperty('refresh_token');
  // });

  it('Should return 400 when token is invalid', async () => {
    const refreshTokenData: RefreshTokenDto = {
      refresh_token: 'invalid_refresh_token',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token/')
      .send(refreshTokenData)
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  afterAll(async () => {
    await app.close();
  });
});
