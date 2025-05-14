import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { RefreshTokenDto } from 'src/modules/auth/application/dto/refresh_token.dto';
import { testData } from '../../mocks/data/test.data';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(false);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/refresh-token', () => {
    it('Should return new authentication payload', async () => {
      const data: RefreshTokenDto = {
        refresh_token: testData.tokensReturns.refresh_token,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token/')
        .send(data)
        .expect(HttpStatus.OK);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    it(`It should return 500 when the token is invalid.
        But it should be adjusted to return 401,
        with the "message" object with the text "Invalid or expired token".`, async () => {
      const data: RefreshTokenDto = {
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token/')
        .send(data)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.body).toHaveProperty('statusCode', 500);
    });

    it('Should return 400 when refresh_token is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token/')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
