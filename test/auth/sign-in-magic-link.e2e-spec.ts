import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { User } from 'src/shared/entities/user.entity';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  const mockUser: User = {
    id: 1,
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
    role: RolesEnum.USER,
    email: 'test@gmail.com',
    name: 'Test User',
    password: 'hashedText',
    is_verified_account: true,
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const validEmailData: EmailDto = {
    email: 'test@gmail.com',
  };

  beforeAll(async () => {
    sendEmailQueueJobMock = {
      execute: jest
        .fn()
        .mockResolvedValue({ message: 'Email sent successfully' }),
    };

    authRepositoryMock = {
      create: jest.fn(),
      findOneByEmail: jest.fn().mockResolvedValue(mockUser),
      updateInfoByIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByPublicIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByEmailAuth: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
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
    authRepositoryMock.findOneByEmail.mockResolvedValue(mockUser);
  });

  describe('POST /auth/sign-in-magic-link', () => {
    it('Should return success message when email is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(validEmailData)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        validEmailData.email,
        {},
      );
      expect(sendEmailQueueJobMock.execute).toHaveBeenCalled();
    });

    it('Should return 401 when email is invalid', async () => {
      authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

      const invalidEmailData: EmailDto = {
        email: 'wrong@gmail.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(invalidEmailData)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        invalidEmailData.email,
        {},
      );
      expect(sendEmailQueueJobMock.execute).not.toHaveBeenCalled();
    });

    it('Should return 401 when account is not verified', async () => {
      const unverifiedAuth = {
        ...mockUser,
        is_verified_account: false,
      };
      authRepositoryMock.findOneByEmail.mockResolvedValueOnce(unverifiedAuth);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send(validEmailData)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid credentials or account not verified',
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        validEmailData.email,
        {},
      );
      expect(sendEmailQueueJobMock.execute).not.toHaveBeenCalled();
    });

    it('Should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-magic-link/')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(authRepositoryMock.findOneByEmail).not.toHaveBeenCalled();
      expect(sendEmailQueueJobMock.execute).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
