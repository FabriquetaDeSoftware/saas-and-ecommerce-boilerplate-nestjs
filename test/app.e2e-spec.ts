import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;
  let token: string;

  const mockAuth: Auth = {
    id: 1,
    public_id: '1',
    role: RolesEnum.USER,
    email: 'test@gmail.com',
    password: 'hashedText',
    is_verified_account: true,
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const signInData: SignInDefaultDto = {
    email: 'test@gmail.com',
    password: '123456',
  };

  beforeAll(async () => {
    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue('hashedText'),
      compareHash: jest.fn().mockResolvedValue(true),
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
      .overrideProvider('IHashUtil')
      .useValue(hashUtilMock)
      .overrideProvider('IAuthRepository')
      .useValue(authRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    authRepositoryMock.findOneByEmail.mockResolvedValue(mockAuth);
    hashUtilMock.compareHash.mockResolvedValue(true);
  });

  describe('POST /auth/sign-in-default', () => {
    it('Should return authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in-default/')
        .send(signInData)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        signInData.email,
        {},
      );
      expect(hashUtilMock.compareHash).toHaveBeenCalledWith(
        signInData.password,
        mockAuth.password,
      );

      token = response.body.access_token;
    });
  });

  describe('GET /hello', () => {
    it('Should return message user', async () => {
      const response = await request(app.getHttpServer())
        .get('/hello/')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
