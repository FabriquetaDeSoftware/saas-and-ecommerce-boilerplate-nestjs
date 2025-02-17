import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue('hashedText'),
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
          ): Promise<Auth> => {
            return Promise.resolve({
              id: 1,
              public_id: '1',
              role: RolesEnum.USER,
              email: dto.email,
              password: 'hashedText',
              is_verified_account: false,
              newsletter_subscription: dto.newsletter_subscription,
              terms_and_conditions_accepted: dto.terms_and_conditions_accepted,
              created_at: new Date(),
              updated_at: new Date(),
            });
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
    await app.init();
  });

  it('Should return created user', async () => {
    const signUpData: SignUpDefaultDto = {
      email: 'test@example.com',
      password: 'Password123!',
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
    };

    const hashedText = 'hashedText';
    const code = hashedText;

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up-default/')
      .send(signUpData)
      .expect(201);

    expect(response.body).not.toHaveProperty('id');
    expect(response.body).toHaveProperty('email', signUpData.email);
    expect(response.body).not.toHaveProperty('password');
    expect(authRepositoryMock.create).toHaveBeenCalledWith(
      {
        ...signUpData,
        password: hashedText,
      },
      code,
      expect.objectContaining({
        getTime: expect.any(Function),
        toISOString: expect.any(Function),
      }),
    );
  });

  it('Should return 409 when email already exists', async () => {
    const signUpData: SignUpDefaultDto = {
      email: 'existing@example.com',
      password: 'Password123!',
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
    };

    authRepositoryMock.findOneByEmail.mockResolvedValueOnce({
      id: 1,
      public_id: '1',
      role: RolesEnum.USER,
      email: signUpData.email,
      password: 'hashedText',
      is_verified_account: false,
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up-default/')
      .send(signUpData)
      .expect(409);

    expect(response.body).toHaveProperty('statusCode', 409);
    expect(response.body).toHaveProperty(
      'message',
      'Unable to process request',
    );
    expect(authRepositoryMock.create).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
