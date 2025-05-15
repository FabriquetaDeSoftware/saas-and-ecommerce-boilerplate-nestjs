import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { EmailDto } from 'src/modules/auth/application/dto/email.dto';
import { testData } from '../../mocks/data/test.data';
import { IGenerateTokenHelper } from 'src/modules/auth/domain/interfaces/helpers/generate_token.helper.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let generateTokenSpy: jest.SpyInstance;

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

    const generateTokenHelper = moduleFixture.get<IGenerateTokenHelper>(
      'IGenerateTokenHelper',
    );
    generateTokenSpy = jest.spyOn(generateTokenHelper, 'execute');

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/forgot-password', () => {
    it('Should return email sent to user', async () => {
      const data: EmailDto = {
        email: testData.userSignupDefault.email,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send(data)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty(
        'message',
        'Email sent successfully',
      );

      const generatedToken = await generateTokenSpy.mock.results[0].value;

      testData.tokensReturnsUser.token = generatedToken.token;
    });

    it('Should return 404 when email is invalid', async () => {
      const data: EmailDto = {
        email: 'wrong@email.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send(data)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('Should return 400 when email is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password/')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
