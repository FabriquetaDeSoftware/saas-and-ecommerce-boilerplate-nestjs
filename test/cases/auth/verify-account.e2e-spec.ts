import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { VerificationCodeDto } from 'src/modules/auth/application/dto/verification_code.dto';
import {
  userSignupDefaultData,
  userSignupPasswordLessData,
} from '../../mocks/data/user.data';

describe('AuthController Verification Account (e2e)', () => {
  let app: INestApplication;

  const VALID_VERIFICATION_DATA: VerificationCodeDto[] = [];
  const INVALID_VERIFICATION_DATA: VerificationCodeDto = {
    email: 'codeexpired@exemple.com',
    code: 123456,
  };

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

  describe('POST /auth/verify-account/', () => {
    it('should return 400 when verification code is invalid', async () => {
      const invalidCodeData = VALID_VERIFICATION_DATA.map((data) => ({
        ...data,
        email: userSignupDefaultData.user.email,
        code: 654321,
      }));

      const responses = await Promise.all(
        invalidCodeData.map((data) => {
          return request(app.getHttpServer())
            .post('/auth/verify-account/')
            .send(data)
            .expect(HttpStatus.BAD_REQUEST);
        }),
      );

      responses.map((response) => {
        expect(response.body).toHaveProperty(
          'statusCode',
          HttpStatus.BAD_REQUEST,
        );
        expect(response.body).toHaveProperty(
          'message',
          'Invalid or expired code',
        );
      });
    });

    it('should return 400 when code is expired', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(INVALID_VERIFICATION_DATA)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.BAD_REQUEST,
      );

      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired code',
      );
    });

    it('should verify user account when code is valid', async () => {
      const DATA: VerificationCodeDto[] = [
        {
          email: userSignupDefaultData.user.email,
          code: parseInt(userSignupDefaultData.verificationCode.code),
        },
        {
          email: userSignupPasswordLessData.user.email,
          code: parseInt(userSignupPasswordLessData.verificationCode.code),
        },
      ];

      const responses = await Promise.all(
        DATA.map((data) => {
          return request(app.getHttpServer())
            .post('/auth/verify-account/')
            .send(data)
            .expect(HttpStatus.OK);
        }),
      );

      responses.map((response) => {
        expect(response.body).toHaveProperty(
          'message',
          'User account verified',
        );
      });
    });

    it('should return 404 when email is not found', async () => {
      const data: VerificationCodeDto = {
        email: 'wrong@gmail.com',
        code: parseInt(userSignupDefaultData.verificationCode.code),
      };

      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(data)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('statusCode', HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'User email not found');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
