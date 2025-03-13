import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  const mockAuth: Auth = {
    id: 1,
    public_id: '1',
    role: RolesEnum.USER,
    email: 'test@gmail.com',
    password: '123456',
    is_verified_account: true,
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const forgotPassData: EmailDto = {
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
      findOneByEmail: jest.fn().mockResolvedValue(mockAuth),
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
    authRepositoryMock.findOneByEmail.mockResolvedValue(mockAuth);
  });

  describe('POST /auth/forgot-password', () => {
    it('Should return email sent to user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send(forgotPassData)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        forgotPassData.email,
        {},
      );
      expect(sendEmailQueueJobMock.execute).toHaveBeenCalledTimes(1);
    });

    it('Should return 404 when email is invalid', async () => {
      authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send(forgotPassData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        forgotPassData.email,
        {},
      );
      expect(sendEmailQueueJobMock.execute).not.toHaveBeenCalled();
    });

    it('Should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(authRepositoryMock.findOneByEmail).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
