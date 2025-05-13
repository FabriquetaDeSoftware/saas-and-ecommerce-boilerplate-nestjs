import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';
import { testData } from '../../mocks/data/test.data';

describe('AuthController PasswordLess (e2e)', () => {
  let app: INestApplication;
  let generateNumberCodeUtilMock: jest.Mocked<IGenerateNumberCodeUtil>;

  const VALID_USER_DATA: SignUpMagicLinkDto = {
    name: 'Test User',
    email: 'signuppassless@example.com',
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
  };

  const VALID_NUMBER_CODE: string = '123456';

  beforeAll(async () => {
    generateNumberCodeUtilMock = {
      execute: jest.fn().mockResolvedValue(VALID_NUMBER_CODE),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IGenerateNumberCodeUtil')
      .useValue(generateNumberCodeUtilMock)
      .compile();

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

  describe('POST /auth/sign-up-password-less/', () => {
    it('should create a new user with magic link and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-password-less/')
        .send(VALID_USER_DATA)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('public_id');
      expect(response.body).toHaveProperty('name', VALID_USER_DATA.name);
      expect(response.body).toHaveProperty('email', VALID_USER_DATA.email);
      expect(response.body).toHaveProperty(
        'newsletter_subscription',
        VALID_USER_DATA.newsletter_subscription,
      );
      expect(response.body).toHaveProperty(
        'terms_and_conditions_accepted',
        VALID_USER_DATA.terms_and_conditions_accepted,
      );
      expect(response.body).toHaveProperty('is_verified_account', false);
      expect(response.body).toHaveProperty('role', RolesEnum.USER);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
      expect(response.body).not.toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');

      testData.userSignupPasswordLess.email = VALID_USER_DATA.email;
      testData.verificationCode.code = VALID_NUMBER_CODE;
      testData.verificationCode.expires_at = new Date();
    });

    it('should return 409 when email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-password-less/')
        .send(VALID_USER_DATA)
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toHaveProperty('statusCode', HttpStatus.CONFLICT);
      expect(response.body).toHaveProperty(
        'message',
        'Unable to process request',
      );
    });

    it('should validate required fields and return 400 for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        newsletter_subscription: true,
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up-password-less/')
        .send(invalidData)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
