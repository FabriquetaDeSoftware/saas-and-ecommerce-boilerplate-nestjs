import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    authRepositoryMock = {
      create: jest.fn().mockImplementation(undefined),
      findOneByEmail: jest.fn().mockImplementation(
        (email: string): Promise<Auth> =>
          Promise.resolve({
            id: 1,
            public_id: '1',
            role: RolesEnum.USER,
            email,
            password: '123456',
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
      .overrideProvider('IAuthRepository')
      .useValue(authRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return email sent to user', async () => {
    const forgotPassData: EmailDto = {
      email: 'test@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password/')
      .send(forgotPassData)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Email sent successfully');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      forgotPassData.email,
    );
  });

  it('Should return 404 when email is invalid', async () => {
    authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

    const forgotPassData: EmailDto = {
      email: 'test@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password/')
      .send(forgotPassData)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'User not found');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      forgotPassData.email,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
