import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    sendEmailQueueJobMock = {
      execute: jest
        .fn()
        .mockResolvedValue({ message: 'Email sent successfully' }),
    };

    authRepositoryMock = {
      create: jest.fn().mockImplementation(undefined),
      findOneByEmail: jest.fn().mockImplementation(
        (email: string): Promise<Auth> =>
          Promise.resolve({
            id: 1,
            public_id: '1',
            role: RolesEnum.USER,
            email,
            password: 'hashedText',
            is_verified_account: true,
            newsletter_subscription: true,
            terms_and_conditions_accepted: true,
            created_at: new Date(),
            updated_at: new Date(),
          }),
      ),
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
    await app.init();
  });

  it('Should return authenticated user', async () => {
    const signInData: EmailDto = {
      email: 'test@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-magic-link/')
      .send(signInData)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Email sent successfully');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      signInData.email,
    );
  });

  it('Should return 401 when email is invalid', async () => {
    authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

    const signInData: EmailDto = {
      email: 'wrong@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-magic-link/')
      .send(signInData)
      .expect(401);

    expect(response.body).toHaveProperty('statusCode', 401);
    expect(response.body).toHaveProperty(
      'message',
      'Invalid credentials or account not verified',
    );
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      signInData.email,
    );
  });

  it('Should return 401 when account is not verified', async () => {
    authRepositoryMock.findOneByEmail.mockResolvedValueOnce({
      id: 1,
      public_id: '1',
      role: RolesEnum.USER,
      email: 'test@gmail.com',
      password: 'hashedText',
      is_verified_account: false,
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const signInData: EmailDto = {
      email: 'test@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-magic-link/')
      .send(signInData)
      .expect(401);

    expect(response.body).toHaveProperty('statusCode', 401);
    expect(response.body).toHaveProperty(
      'message',
      'Invalid credentials or account not verified',
    );
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      signInData.email,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
