import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PasswordDto } from 'src/modules/auth/application/dto/password.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;

  const validToken = 'valid_token';
  const invalidToken = 'invalid_token';
  const testEmail = 'test@example.com';
  const testPassword = '123456';
  const testUserId = '123';

  const mockJwtPayload: IJwtUserPayload = {
    email: Buffer.from(testEmail).toString('base64'),
    role: 'user',
    sub: testUserId,
    type: Buffer.from(TokenEnum.RECOVERY_PASSWORD_TOKEN).toString('base64'),
  };

  const recoveryPasswordData: PasswordDto = {
    password: testPassword,
  };

  beforeAll(async () => {
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
        public_id: testUserId,
        email: testEmail,
      }),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
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
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Password recovered successfully',
      );
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(validToken);
      expect(authRepositoryMock.updateInfoByEmailAuth).toHaveBeenCalled();
    });

    it('Should return 400 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post(`/auth/recovery-password?token=${invalidToken}`)
        .send(recoveryPasswordData)
        .expect(400);

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
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(jwtServiceMock.verify).not.toHaveBeenCalled();
      expect(authRepositoryMock.updateInfoByEmailAuth).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
