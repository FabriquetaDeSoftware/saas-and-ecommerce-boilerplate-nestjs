import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RefreshTokenDto } from 'src/modules/auth/application/dto/refresh_token.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from 'src/shared/enum/token.enum';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { IAuthRepository } from 'src/modules/auth/domain/interfaces/repositories/auth.repository.interface';
import { jwtKeysConstants } from 'src/shared/constants/jwt_keys.constants';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let authRepositoryMock: jest.Mocked<IAuthRepository>;

  const validToken = 'valid_token';
  const invalidToken = 'invalid_token';
  const testEmail = 'test@example.com';
  const testUserId = '123';

  const mockJwtPayload: IJwtUserPayload = {
    email: Buffer.from(testEmail).toString('base64'),
    role: 'user',
    sub: testUserId,
    type: Buffer.from(TokenEnum.REFRESH_TOKEN).toString('base64'),
  };

  const validRefreshTokenData: RefreshTokenDto = {
    refresh_token: validToken,
  };

  const invalidRefreshTokenData: RefreshTokenDto = {
    refresh_token: invalidToken,
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
      sign: jest.fn().mockImplementation(() => 'new_access_token'),
    } as any;

    authRepositoryMock = {
      findOneByEmail: jest.fn().mockResolvedValue({
        id: 1,
        public_id: testUserId,
        email: testEmail,
        role: 'user',
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

  describe('POST /auth/refresh-token', () => {
    it('Should return new authentication payload', async () => {
      // const response = await request(app.getHttpServer())
      //   .post('/auth/refresh-token/')
      //   .send(validRefreshTokenData)
      //   .expect(200);
      // expect(response.body).toHaveProperty('access_token');
      // expect(response.body).toHaveProperty('refresh_token');
      // expect(jwtServiceMock.verify).toHaveBeenCalledWith(validToken);
      // expect(jwtServiceMock.sign).toHaveBeenCalled();
      // expect(authRepositoryMock.findOneByEmail).toHaveBeenCalled();
    });

    it('Should return 400 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token/')
        .send(invalidRefreshTokenData)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid or expired token',
      );
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(invalidToken, {
        secret: jwtKeysConstants.secret_refresh_token_key,
      });
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('Should return 400 when refresh_token is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token/')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(jwtServiceMock.verify).not.toHaveBeenCalled();
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
