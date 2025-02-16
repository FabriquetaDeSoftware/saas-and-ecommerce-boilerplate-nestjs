import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue('hashedText'),
      compareHash: jest.fn().mockResolvedValue(true),
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
      .overrideProvider('IHashUtil')
      .useValue(hashUtilMock)
      .overrideProvider('IAuthRepository')
      .useValue(authRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return authenticated user', async () => {
    const signInData: SignInDefaultDto = {
      email: 'test@gmail.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-default/')
      .send(signInData)
      .expect(200);

    const mockReturn = await authRepositoryMock.findOneByEmail(
      signInData.email,
    );

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      signInData.email,
    );
  });

  it('Should return 401 when email is invalid', async () => {
    authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

    const signInData: SignInDefaultDto = {
      email: 'wrong@gmail.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-default/')
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

  it('Should return 401 when password is invalid', async () => {
    const signInData: SignInDefaultDto = {
      email: 'test@gmail.com',
      password: 'wrong123',
    };

    hashUtilMock.compareHash.mockResolvedValueOnce(false);

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-default/')
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
    expect(hashUtilMock.compareHash).toHaveBeenCalledWith(
      signInData.password,
      'hashedText',
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

    const signInData: SignInDefaultDto = {
      email: 'test@gmail.com',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in-default/')
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
