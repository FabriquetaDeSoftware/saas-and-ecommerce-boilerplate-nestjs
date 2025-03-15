import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { GenerateTokenHelper } from 'src/modules/auth/shared/helpers/generate_token.helper';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';

describe('Rotas Protegidas (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let cryptoUtil: ICryptoUtil;
  let generateTokenHelper: GenerateTokenHelper;

  let accessToken: string;
  let invalidToken: string = 'invalid_token';

  const testEmail = 'test@example.com';
  const testUserId = '123';

  beforeAll(async () => {
    const cryptoUtilMock = {
      encryptData: jest.fn().mockImplementation((data: string) => {
        return Promise.resolve(Buffer.from(data));
      }),
      decryptData: jest.fn().mockImplementation((data: Buffer) => {
        return Promise.resolve(data.toString());
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ICryptoUtil')
      .useValue(cryptoUtilMock)
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

    jwtService = moduleFixture.get<JwtService>(JwtService);
    cryptoUtil = moduleFixture.get<ICryptoUtil>('ICryptoUtil');

    generateTokenHelper = new GenerateTokenHelper();
    Object.defineProperty(generateTokenHelper, '_jwtService', {
      value: jwtService,
      writable: true,
    });
    Object.defineProperty(generateTokenHelper, '_cryptoUtil', {
      value: cryptoUtil,
      writable: true,
    });
  });

  describe('GET /protected-route', () => {
    it('Should return message to authenticated user', async () => {
      const tokenDto: GenerateTokenDto = {
        email: testEmail,
        sub: testUserId,
        role: RolesEnum.USER,
      };

      const tokens = await generateTokenHelper.execute(tokenDto);
      accessToken = tokens.access_token;

      const response = await request(app.getHttpServer())
        .get('/protected-route/')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
    });

    it('Should return 401 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/protected-route/')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message');
    });

    it('Should return 401 to request not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/protected-route/')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
