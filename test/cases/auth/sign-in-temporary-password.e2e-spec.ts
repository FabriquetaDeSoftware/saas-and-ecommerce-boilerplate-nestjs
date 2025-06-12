import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { SignInOneTimePasswordDto } from 'src/modules/auth/application/dto/sign_in_one_time_password.dto';
import {
  userSignupDefaultData,
  userSignupPasswordLessData,
} from '../../mocks/data/user.data';

describe('AuthController SignIn Temporary Password (e2e)', () => {
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

  describe('POST /auth/sign-in-one-time-password', () => {
    it('Should return authenticated user', async () => {
      const data: SignInOneTimePasswordDto = {
        email: userSignupPasswordLessData.user.email,
        password: userSignupPasswordLessData.oneTimePassword.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-one-time-password/')
        .send(data)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    it('Should return 401 when email is invalid', async () => {
      const invalidEmailData: SignInOneTimePasswordDto = {
        email: 'wrong@gmail.com',
        password: userSignupPasswordLessData.oneTimePassword.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-one-time-password/')
        .send(invalidEmailData)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });

    it('Should return 401 when password is invalid', async () => {
      const invalidPass = (
        userSignupPasswordLessData.oneTimePassword.password || ''
      )
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

      const invalidPasswordData: SignInOneTimePasswordDto = {
        email: userSignupDefaultData.user.email,
        password: invalidPass,
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
      const data: SignInOneTimePasswordDto = {
        email: 'notverify@exemple.com',
        password: userSignupPasswordLessData.oneTimePassword.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-one-time-password/')
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
