import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  const VALID_USER_DATA: SignUpDefaultDto = {
    email: 'test@example.com',
    password: 'Password123!',
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
  };

  const HASHED_PASSWORD = 'hashedText';

  const mockAuthResponse = (userData: SignUpDefaultDto): Partial<Auth> => ({
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
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
      generateHash: jest.fn().mockResolvedValue(HASHED_PASSWORD),
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
            dto: SignUpDefaultDto,
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
      .overrideProvider('IHashUtil')
      .useValue(hashUtilMock)
      .overrideProvider('ISendEmailQueueJob')
      .useValue(sendEmailQueueJobMock)
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

  describe('POST /auth/sign-up-default/', () => {
    it('should create a new user and return 201 with user data', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
        .send(VALID_USER_DATA)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(
        expect.objectContaining({
          public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
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

      expect(hashUtilMock.generateHash).toHaveBeenCalledWith(
        VALID_USER_DATA.password,
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        VALID_USER_DATA.email,
        {},
      );
      expect(authRepositoryMock.create).toHaveBeenCalledWith(
        {
          ...VALID_USER_DATA,
          password: HASHED_PASSWORD,
        },
        HASHED_PASSWORD,
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
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        role: RolesEnum.USER,
        email: existingUserData.email,
        password: HASHED_PASSWORD,
        is_verified_account: false,
        newsletter_subscription: true,
        terms_and_conditions_accepted: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
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
      expect(authRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      authRepositoryMock.create.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up-default/')
        .send(VALID_USER_DATA)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
