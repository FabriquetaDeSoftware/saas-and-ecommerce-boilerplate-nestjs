import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { userSignupPasswordLessData } from '../../mocks/data/user.data';

describe('AuthController SignIn Magic Link (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('POST /auth/sign-in-magic-link', () => {
    it('Should return success message when email is valid', async () => {
      const data: EmailDto = {
        email: userSignupPasswordLessData.user.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(data)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );
    });

    it('Should return 401 when email is invalid', async () => {
      const data: EmailDto = {
        email: 'wrong@gmail.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(data)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });

    it('Should return 401 when account is not verified', async () => {
      const data: EmailDto = {
        email: 'notverify@exemple.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(data)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
    });

    it('Should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
