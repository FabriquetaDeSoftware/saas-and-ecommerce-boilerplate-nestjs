import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { userSignupPasswordLessData } from '../../mocks/data/user.data';

describe('AuthController Send Temporary Password (e2e)', () => {
  let app: INestApplication;
  let generateCodeSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const generateNumberCodeUtil = moduleFixture.get<IGenerateNumberCodeUtil>(
      'IGenerateNumberCodeUtil',
    );
    generateCodeSpy = jest.spyOn(generateNumberCodeUtil, 'execute');

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/send-one-time-password', () => {
    it('Should return email with OTP', async () => {
      const data: EmailDto = {
        email: userSignupPasswordLessData.user.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/send-one-time-password/')
        .send(data)
        .expect(HttpStatus.OK);

      const generatedCode = await generateCodeSpy.mock.results[0].value;

      userSignupPasswordLessData.oneTimePassword.password = generatedCode.code;

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );
    });

    it('Should return 401 when email is invalid', async () => {
      const invalidEmailData: EmailDto = {
        email: 'wrong@gmail.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/send-one-time-password/')
        .send(invalidEmailData)
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
        .post('/auth/send-one-time-password/')
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
