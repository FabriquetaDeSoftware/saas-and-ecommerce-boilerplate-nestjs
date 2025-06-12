import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import {
  userSignupDefaultData,
  tokensReturns,
} from '../../mocks/data/user.data';

describe('AuthController SignIn Default (e2e)', () => {
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
      const dataUser: SignInDefaultDto = {
        email: userSignupDefaultData.user.email,
        password: userSignupDefaultData.user.password,
      };

      const responseUser = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(dataUser)
        .expect(HttpStatus.OK);

      expect(responseUser.body).toHaveProperty('access_token');
      expect(responseUser.body).toHaveProperty('refresh_token');

      tokensReturns.tokensUser.access_token = responseUser.body.access_token;
      tokensReturns.tokensUser.refresh_token = responseUser.body.refresh_token;

      const dataAdmin: SignInDefaultDto = {
        email: 'testadmin@exemple.com',
        password: 'Password123!',
      };

      const responseAdmin = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(dataAdmin)
        .expect(HttpStatus.OK);

      expect(responseAdmin.body).toHaveProperty('access_token');
      expect(responseAdmin.body).toHaveProperty('refresh_token');

      tokensReturns.tokensAdmin.access_token = responseAdmin.body.access_token;
      tokensReturns.tokensAdmin.refresh_token =
        responseAdmin.body.refresh_token;
    });

    it('Should return 401 when email is invalid', async () => {
      const invalidEmailData = {
        email: 'wrong@gmail.com',
        password: userSignupDefaultData.user.password,
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
        email: userSignupDefaultData.user.email,
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
        password: userSignupDefaultData.user.password,
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
