import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { GenerateTokenHelper } from 'src/modules/auth/shared/helpers/generate_token.helper';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';

describe('Admin Protected Routes (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let cryptoUtil: ICryptoUtil;
  let generateTokenHelper: GenerateTokenHelper;

  const TEST_USER = {
    email: 'test@example.com',
    id: '123',
  };

  const ROLES = {
    VALID: RolesEnum.ADMIN,
    INVALID: RolesEnum.USER,
  };

  const TOKENS = {
    INVALID: 'invalid_token',
  };

  const generateAuthToken = async (role: RolesEnum): Promise<string> => {
    const tokenDto: GenerateTokenDto = {
      email: TEST_USER.email,
      sub: TEST_USER.id,
      role,
    };
    const tokens = await generateTokenHelper.execute(tokenDto);
    return tokens.access_token;
  };

  beforeAll(async () => {
    const cryptoUtilMock = {
      encryptData: jest
        .fn()
        .mockImplementation((data: string) =>
          Promise.resolve(Buffer.from(data)),
        ),
      decryptData: jest
        .fn()
        .mockImplementation((data: Buffer) => Promise.resolve(data.toString())),
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin', () => {
    it('should return success message when user has admin role', async () => {
      const adminToken = await generateAuthToken(ROLES.VALID);

      const response = await request(app.getHttpServer())
        .get('/admin/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeTruthy();
    });

    it('should return 403 when user has insufficient role permissions', async () => {
      const userToken = await generateAuthToken(ROLES.INVALID);

      const response = await request(app.getHttpServer())
        .get('/admin/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Forbidden');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/')
        .set('Authorization', `Bearer ${TOKENS.INVALID}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 when request has no authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/')
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
