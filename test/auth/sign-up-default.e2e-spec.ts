import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IGenerateNumberCodeUtil } from 'src/shared/utils/interfaces/generate_number_code.util.interface';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let generateNumberCodeUtilMock: jest.Mocked<IGenerateNumberCodeUtil>;

  const VALID_USER_DATA: SignUpDefaultDto = {
    name: 'Test User',
    email: 'signupdefault@example.com',
    password: 'Password123!',
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
  };

  beforeAll(async () => {
    generateNumberCodeUtilMock = {
      execute: jest.fn().mockResolvedValue('123456'),
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

  describe('POST /auth/sign-up-default/', () => {
    it('should create a new user and return 201 with user data', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
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
    });

    it('should return 409 when email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
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
        password: '123',
        newsletter_subscription: true,
        terms_and_conditions_accepted: false,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
        .send(invalidData)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
