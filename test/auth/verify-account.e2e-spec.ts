import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { VerificationCodeDto } from 'src/modules/auth/application/dto/verification_code.dto';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IVerificationCodesRepository } from 'src/modules/auth/domain/interfaces/repositories/verification_codes.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let verificationCodeRepositoryMock: jest.Mocked<IVerificationCodesRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue('hashedText'),
      compareHash: jest.fn().mockResolvedValue(true),
    };

    verificationCodeRepositoryMock = {
      findVerificationCodeByAuthorId: jest.fn().mockImplementation(
        (auth_id: number): Promise<VerificationCodes> =>
          Promise.resolve({
            id: 1,
            public_id: '1',
            auth_id,
            code: 'hashedText',
            created_at: new Date(),
            expires_at: new Date(),
          }),
      ),
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
            is_verified_account: false,
            newsletter_subscription: true,
            terms_and_conditions_accepted: true,
            created_at: new Date(),
            updated_at: new Date(),
          }),
      ),
      updateInfoByIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByPublicIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByEmailAuth: jest.fn().mockResolvedValue(
        (email: string, verify: boolean): Promise<Auth> =>
          Promise.resolve({
            id: 1,
            public_id: '1',
            role: RolesEnum.USER,
            email,
            password: 'hashedText',
            is_verified_account: verify,
            newsletter_subscription: true,
            terms_and_conditions_accepted: true,
            created_at: new Date(),
            updated_at: new Date(),
          }),
      ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IHashUtil')
      .useValue(hashUtilMock)
      .overrideProvider('IVerificationCodesRepository')
      .useValue(verificationCodeRepositoryMock)
      .overrideProvider('IAuthRepository')
      .useValue(authRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return user account verified', async () => {
    const verifyAccountData: VerificationCodeDto = {
      email: 'test@gmail.com',
      code: 123456,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/verify-account/')
      .send(verifyAccountData)
      .expect(200);

    const authorId = 1;

    expect(response.body).toHaveProperty('message', 'User account verified');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      verifyAccountData.email,
    );
    expect(authRepositoryMock.updateInfoByEmailAuth).toHaveBeenCalledWith(
      verifyAccountData.email,
      { is_verified_account: true },
    );
    expect(
      verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
    ).toHaveBeenCalledWith(authorId);
  });

  it('Should return 404 when email is invalid', async () => {
    authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

    const verifyAccountData: VerificationCodeDto = {
      email: 'wrong@gmail.com',
      code: 123456,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/verify-account/')
      .send(verifyAccountData)
      .expect(404);

    const authorId = 1;

    expect(response.body).toHaveProperty('statusCode', 404);
    expect(response.body).toHaveProperty('message', 'User email not found');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      verifyAccountData.email,
    );
    expect(
      verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
    ).not.toHaveBeenCalledWith(authorId);
  });

  it('Should return 400 when code is invalid', async () => {
    const verifyAccountData: VerificationCodeDto = {
      email: 'test@gmail.com',
      code: 654321,
    };

    verificationCodeRepositoryMock.findVerificationCodeByAuthorId.mockResolvedValue(
      {
        id: 1,
        public_id: '1',
        auth_id: 1,
        code: '123456',
        created_at: new Date(),
        expires_at: new Date(),
      },
    );

    const response = await request(app.getHttpServer())
      .post('/auth/verify-account/')
      .send(verifyAccountData)
      .expect(400);

    const authorId = 1;

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired code');
    expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      verifyAccountData.email,
    );
    expect(
      verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
    ).toHaveBeenCalledWith(authorId);
  });

  afterAll(async () => {
    await app.close();
  });
});
