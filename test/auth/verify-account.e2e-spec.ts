import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { VerificationCodeDto } from 'src/modules/auth/application/dto/verification_code.dto';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IVerificationCodesRepository } from 'src/modules/auth/domain/interfaces/repositories/verification_codes.repository.interface';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { VerificationCodes } from 'src/modules/auth/domain/entities/verification_codes.entity';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { ISendEmailQueueJob } from 'src/shared/modules/email/domain/interfaces/jobs/send_email_queue.job.interface';

describe('AuthController Verification (e2e)', () => {
  let app: INestApplication;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let verificationCodeRepositoryMock: jest.Mocked<IVerificationCodesRepository>;
  let hashUtilMock: jest.Mocked<IHashUtil>;
  let sendEmailQueueJobMock: jest.Mocked<ISendEmailQueueJob>;

  const VALID_VERIFICATION_DATA: VerificationCodeDto = {
    email: 'test@gmail.com',
    code: 123456,
  };

  const MOCK_AUTH_ID = 1;
  const HASHED_CODE = 'hashedText';

  const mockAuthResponse = (
    email: string,
    isVerified: boolean = false,
  ): Auth => ({
    id: MOCK_AUTH_ID,
    public_id: '1',
    role: RolesEnum.USER,
    email,
    password: HASHED_CODE,
    is_verified_account: isVerified,
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const mockVerificationCode = (
    auth_id: number,
    code: string = HASHED_CODE,
  ): VerificationCodes => ({
    id: 1,
    public_id: '1',
    auth_id,
    code,
    created_at: new Date(),
    expires_at: new Date(),
  });

  beforeAll(async () => {
    hashUtilMock = {
      generateHash: jest.fn().mockResolvedValue(HASHED_CODE),
      compareHash: jest.fn().mockResolvedValue(true),
    };

    verificationCodeRepositoryMock = {
      findVerificationCodeByAuthorId: jest
        .fn()
        .mockImplementation(
          (auth_id: number): Promise<VerificationCodes> =>
            Promise.resolve(mockVerificationCode(auth_id)),
        ),
    };

    sendEmailQueueJobMock = {
      execute: jest
        .fn()
        .mockResolvedValue({ message: 'Email sent successfully' }),
    };

    authRepositoryMock = {
      create: jest.fn(),
      findOneByEmail: jest
        .fn()
        .mockImplementation(
          (email: string): Promise<Auth> =>
            Promise.resolve(mockAuthResponse(email)),
        ),
      updateInfoByIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByPublicIdAuth: jest.fn().mockResolvedValue(undefined),
      updateInfoByEmailAuth: jest
        .fn()
        .mockImplementation(
          (email: string, data: any): Promise<Auth> =>
            Promise.resolve(mockAuthResponse(email, true)),
        ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ISendEmailQueueJob')
      .useValue(sendEmailQueueJobMock)
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/verify-account/', () => {
    it('should verify user account when code is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(VALID_VERIFICATION_DATA)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message', 'User account verified');
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        VALID_VERIFICATION_DATA.email,
        {},
      );
      expect(
        verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
      ).toHaveBeenCalledWith(MOCK_AUTH_ID);
      expect(authRepositoryMock.updateInfoByEmailAuth).toHaveBeenCalledWith(
        VALID_VERIFICATION_DATA.email,
        { is_verified_account: true },
      );
    });

    it('should return 404 when email is not found', async () => {
      authRepositoryMock.findOneByEmail.mockResolvedValueOnce(null);

      const invalidEmailData = {
        ...VALID_VERIFICATION_DATA,
        email: 'wrong@gmail.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(invalidEmailData)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('statusCode', HttpStatus.NOT_FOUND);
      expect(response.body).toHaveProperty('message', 'User email not found');
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        invalidEmailData.email,
        {},
      );
      expect(
        verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
      ).not.toHaveBeenCalled();
      expect(authRepositoryMock.updateInfoByEmailAuth).not.toHaveBeenCalled();
    });

    it('should return 400 when verification code is invalid', async () => {
      const invalidCodeData = {
        ...VALID_VERIFICATION_DATA,
        code: 654321,
      };

      verificationCodeRepositoryMock.findVerificationCodeByAuthorId.mockResolvedValueOnce(
        mockVerificationCode(MOCK_AUTH_ID, '123456'),
      );

      hashUtilMock.compareHash.mockResolvedValueOnce(false);

      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(invalidCodeData)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.BAD_REQUEST,
      );
      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired code',
      );
      expect(authRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
        invalidCodeData.email,
        {},
      );
      expect(
        verificationCodeRepositoryMock.findVerificationCodeByAuthorId,
      ).toHaveBeenCalledWith(MOCK_AUTH_ID);
      expect(authRepositoryMock.updateInfoByEmailAuth).not.toHaveBeenCalled();
    });

    it('should return 400 when code is expired', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // Set to yesterday

      verificationCodeRepositoryMock.findVerificationCodeByAuthorId.mockResolvedValueOnce(
        {
          id: 1,
          public_id: '1',
          auth_id: MOCK_AUTH_ID,
          code: HASHED_CODE,
          created_at: expiredDate,
          expires_at: expiredDate,
        },
      );

      const response = await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(VALID_VERIFICATION_DATA)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.BAD_REQUEST,
      );
      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired code',
      );
    });

    it('should handle server error gracefully', async () => {
      authRepositoryMock.findOneByEmail.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await request(app.getHttpServer())
        .post('/auth/verify-account/')
        .send(VALID_VERIFICATION_DATA)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
