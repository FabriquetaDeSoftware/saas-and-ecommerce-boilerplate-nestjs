import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController PasswordLess (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  const VALID_USER_DATA: SignUpMagicLinkDto = {
    email: 'test@example.com',
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
  };

  const HASHED_CODE = 'hashedText';

  const mockAuthResponse = (userData: SignUpMagicLinkDto): Partial<Auth> => ({
    public_id: '1',
    role: RolesEnum.USER,
    email: userData.email,
    is_verified_account: false,
    newsletter_subscription: userData.newsletter_subscription,
    terms_and_conditions_accepted: userData.terms_and_conditions_accepted,
    created_at: new Date(),
    updated_at: new Date(),
  });

  beforeAll(async () => {
    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue(HASHED_CODE),
      compareHash: jest.fn().mockResolvedValue(true),
    };

    sendEmailQueueJobMock = {
      execute: jest
        .fn()
        .mockResolvedValue({ message: 'Email sent successfully' }),
    };

    authRepositoryMock = {
      create: jest
        .fn()
        .mockImplementation(
          (
            dto: SignUpMagicLinkDto,
            code: string,
            expires_at: Date,
            exclude?: any,
          ): Promise<Partial<Auth>> => {
            return Promise.resolve(mockAuthResponse(dto));
          },
        ),
      findOneByEmail: jest.fn().mockResolvedValue(null),
      updateInfoByIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByPublicIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByEmailAuth: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ISendEmailQueueJob')
      .useValue(sendEmailQueueJobMock)
      .overrideProvider('IHashUtil')
      .useValue(hashUtilMock)
      .overrideProvider('IAuthRepository')
      .useValue(authRepositoryMock)
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

      expect(response.body).toEqual(
        expect.objectContaining({
          email: VALID_USER_DATA.email,
          newsletter_subscription: VALID_USER_DATA.newsletter_subscription,
          terms_and_conditions_accepted:
            VALID_USER_DATA.terms_and_conditions_accepted,
          is_verified_account: false,
          role: RolesEnum.USER,
        }),
      );

      expect(response.body).not.toHaveProperty('id');
      expect(response.body).not.toHaveProperty('password');

      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        VALID_USER_DATA.email,
        {},
      );
      expect(authRepositoryMock.create).toHaveBeenCalledWith(
        VALID_USER_DATA,
        HASHED_CODE,
        expect.any(Date),
        { id: true, password: true },
      );
      expect(sendEmailQueueJobMock.execute).toHaveBeenCalled();
    });

    it('should return 409 when email already exists', async () => {
      const existingUserData = {
        ...VALID_USER_DATA,
        email: 'existing@example.com',
      };

      authRepositoryMock.findOneByEmail.mockResolvedValueOnce({
        id: 1,
        public_id: '1',
        role: RolesEnum.USER,
        email: existingUserData.email,
        password: null,
        is_verified_account: false,
        newsletter_subscription: true,
        terms_and_conditions_accepted: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-password-less/')
        .send(existingUserData)
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toHaveProperty('statusCode', HttpStatus.CONFLICT);
      expect(response.body).toHaveProperty(
        'message',
        'Unable to process request',
      );
      expect(authRepositoryMock.create).not.toHaveBeenCalled();
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

      expect(authRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should handle email service failures gracefully', async () => {
      sendEmailQueueJobMock.execute.mockRejectedValueOnce(
        new Error('Email service error'),
      );

      await request(app.getHttpServer())
        .post('/auth/sign-up-password-less/')
        .send(VALID_USER_DATA)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
