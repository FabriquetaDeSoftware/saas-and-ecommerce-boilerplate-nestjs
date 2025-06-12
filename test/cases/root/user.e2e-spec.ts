import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { tokensReturns } from '../../mocks/data/user.data';

describe('User Protected Routes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  describe('GET /user', () => {
    it('should return success message when user has user role', async () => {
      const userToken = tokensReturns.tokensUser.access_token;

      const response = await request(app.getHttpServer())
        .get('/user/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeTruthy();
    });

    it('should return 403 when user has insufficient role permissions', async () => {
      const adminToken = tokensReturns.tokensAdmin.access_token;

      const response = await request(app.getHttpServer())
        .get('/user/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Forbidden');
    });

    it('should return 401 when token is invalid', async () => {
      const invalidToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

      const response = await request(app.getHttpServer())
        .get('/user/')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 when request has no authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/')
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toHaveProperty('message');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
