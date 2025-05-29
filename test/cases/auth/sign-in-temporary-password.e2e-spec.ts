import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { testData } from '../../mocks/data/test.data';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';

describe('AuthController SignIn Temporary Password (e2e)', () => {
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

  describe('POST /auth/sign-in-temporary-password', () => {
    it('Should return authenticated user', async () => {
      const data: SignInDefaultDto = {
        email: testData.userSignupPasswordLess.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-temporary-password/')
        .send(data)
        .expect(HttpStatus.OK);

      const generatedCode = await generateCodeSpy.mock.results[0].value;

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );
    });

    it('Should return 401 when email is invalid', async () => {
      const invalidEmailData: SignInDefaultDto = {
        email: 'wrong@gmail.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-temporary-password/')
        .send(invalidEmailData)
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
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-temporary-password/')
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
