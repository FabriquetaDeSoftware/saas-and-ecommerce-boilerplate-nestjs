import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  BadRequestException,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PasswordDto } from 'src/modules/auth/application/dto/password.dto';
import { testData } from '../../mocks/data/test.data';

describe('AuthController Recovery Password (e2e)', () => {
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

  describe('POST /auth/recovery-password', () => {
    it('Should return password recovery success', async () => {
      const validToken = testData.tokensReturnsUser.token;
      const recoveryPasswordData: PasswordDto = {
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${validToken}`)
        .send(recoveryPasswordData)
        .expect(HttpStatus.OK);
      expect(response.body).toHaveProperty(
        'message',
        'Password recovered successfully',
      );
    });

    it(`It should return 500 when the token is invalid.
        But it should be adjusted to return 401,
        with the "message" object with the text "Invalid or expired token`, async () => {
      const invalidToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

      const recoveryPasswordData: PasswordDto = {
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${invalidToken}`)
        .send(recoveryPasswordData)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.body).toHaveProperty('statusCode', 500);
    });

    it('Should return 400 when password is missing', async () => {
      const validToken = testData.tokensReturnsUser.token;

      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${validToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
