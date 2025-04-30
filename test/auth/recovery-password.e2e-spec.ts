import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  BadRequestException,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PasswordDto } from 'src/modules/auth/application/dto/password.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;
  let cryptoUtilMock: jest.Mocked<ICryptoUtil>;

  const validToken = 'valid_token';
  const invalidToken = 'invalid_token';
  const testEmail = 'test@example.com';
  const testPassword = '123456';
  const testUserPublicId = '9f3b779d-1ffc-4812-ab14-4e3687741538';
  const testName = 'Test User';

  const mockJwtPayload: IJwtUserPayload = {
    email: Buffer.from(testEmail).toString('base64'),
    role: Buffer.from(RolesEnum.USER).toString('base64'),
    sub: Buffer.from(testUserPublicId).toString('base64'),
    name: Buffer.from(testName).toString('base64'),
    type: Buffer.from(TokenEnum.RECOVERY_PASSWORD_TOKEN).toString('base64'),
  };

  const recoveryPasswordData: PasswordDto = {
    password: testPassword,
  };

  beforeAll(async () => {
    cryptoUtilMock = {
      encryptData: jest.fn().mockResolvedValue(Buffer.from('encrypted_data')),
      decryptData: jest.fn().mockImplementation(async (data: Buffer) => {
        if (data.toString() === 'encrypted_data') {
          return 'decrypted_data';
        }
        if (data.toString() === 'encrypted_email') {
          return testEmail;
        }
        if (data.toString() === 'encrypted_role') {
          return RolesEnum.USER;
        }
        if (data.toString() === 'encrypted_sub') {
          return testUserPublicId;
        }
        if (data.toString() === 'recovery_password_token') {
          return TokenEnum.RECOVERY_PASSWORD_TOKEN;
        }
        return 'default_decrypted_value';
      }),
    } as any;

    jwtServiceMock = {
      verify: jest
        .fn()
        .mockImplementation((token: string): Promise<IJwtUserPayload> => {
          if (token === validToken) {
            return Promise.resolve(mockJwtPayload);
          } else {
            throw new BadRequestException('Invalid or expired token');
          }
        }),
    } as any;

    authRepositoryMock = {
      updateInfoByEmailAuth: jest.fn().mockResolvedValue(undefined),
      findOneByEmail: jest.fn().mockResolvedValue({
        id: 1,
        public_id: testUserPublicId,
        email: testEmail,
      }),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider('ICryptoUtil')
      .useValue(cryptoUtilMock)
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

  describe('POST /auth/recovery-password', () => {
    it('Should return password recovery success', async () => {
      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${validToken}`)
        .send(recoveryPasswordData)
        .expect(HttpStatus.OK);
      expect(response.body).toHaveProperty(
        'message',
        'Password recovered successfully',
      );
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(validToken, {
        secret: jwtKeysConstants.secret_recovery_password_token_key,
      });
      expect(authRepositoryMock.updateInfoByEmailAuth).toHaveBeenCalled();
    });

    it('Should return 400 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${invalidToken}`)
        .send(recoveryPasswordData)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired token',
      );

      expect(jwtServiceMock.verify).toHaveBeenCalledWith(invalidToken, {
        secret: jwtKeysConstants.secret_recovery_password_token_key,
      });
      expect(authRepositoryMock.updateInfoByEmailAuth).not.toHaveBeenCalled();
    });

    it('Should return 400 when password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${validToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(jwtServiceMock.verify).not.toHaveBeenCalled();
      expect(authRepositoryMock.updateInfoByEmailAuth).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
