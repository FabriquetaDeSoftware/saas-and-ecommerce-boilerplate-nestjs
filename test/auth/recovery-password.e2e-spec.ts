import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RecoveryPasswordDto } from 'src/modules/auth/application/dto/recovery_password.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { TokenEnum } from 'src/shared/enum/token.enum';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    jwtServiceMock = {
      verify: jest
        .fn()
        .mockImplementation((token: string): Promise<IJwtUserPayload> => {
          if (token === 'valid_token') {
            return Promise.resolve({
              email: Buffer.from('test@example.com').toString('base64'),
              role: 'user',
              sub: '123',
              type: Buffer.from(TokenEnum.RECOVERY_PASSWORD_TOKEN).toString(
                'base64',
              ),
            });
          } else {
            throw new BadRequestException('Invalid or expired token');
          }
        }),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  // it('Should return password recovery', async () => {
  //   const recoveryPasswordData: RecoveryPasswordDto = {
  //     token: 'valid_token',
  //     password: '123456',
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post('/auth/recovery-password/')
  //     .send(recoveryPasswordData)
  //     .expect(200);

  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Password recovered successfully',
  //   );
  // });

  it('Should return 400 when token is invalid', async () => {
    const recoveryPasswordData: RecoveryPasswordDto = {
      token: 'invalid_token',
      password: '123456',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/recovery-password/')
      .send(recoveryPasswordData)
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  afterAll(async () => {
    await app.close();
  });
});
