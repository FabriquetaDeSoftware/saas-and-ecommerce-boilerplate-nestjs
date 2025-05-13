import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { testData } from '../../mocks/data/test.data';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/sign-in-default', () => {
    it('Should return authenticated user', async () => {
      const data: SignInDefaultDto = {
        email: testData.userSignupDefault.email,
        password: testData.userSignupDefault.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(data)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      testData.tokensReturns.access_token = response.body.access_token;
      testData.tokensReturns.refresh_token = response.body.refresh_token;
    });

    it('Should return 401 when email is invalid', async () => {
      const invalidEmailData = {
        email: 'wrong@gmail.com',
        password: testData.userSignupDefault.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(invalidEmailData)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });

    it('Should return 401 when password is invalid', async () => {
      const invalidPasswordData = {
        email: testData.userSignupDefault.email,
        password: 'wrong123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(invalidPasswordData)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });

    it('Should return 401 when account is not verified', async () => {
      const data: SignInDefaultDto = {
        email: 'notverify@exemple.com',
        password: testData.userSignupDefault.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(data)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
