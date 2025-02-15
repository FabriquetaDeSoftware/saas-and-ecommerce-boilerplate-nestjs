import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { SignUpDefaultUseCase } from 'src/modules/auth/application/use_cases/sign_up_default.use_case';
import { ISignUpDefaultUseCase } from 'src/modules/auth/domain/interfaces/use_cases/sign_up.use_case.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let signUpDefaultUseCaseMock: jest.Mocked<ISignUpDefaultUseCase>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    signUpDefaultUseCaseMock = {
      execute: jest.fn().mockImplementation((dto: SignUpDefaultDto) => {
        return Promise.resolve({
          id: '1',
          email: dto.email,
          newsletter_subscription: dto.newsletter_subscription,
          terms_and_conditions_accepted: dto.terms_and_conditions_accepted,
        });
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SignUpDefaultUseCase)
      .useValue(signUpDefaultUseCaseMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should return created user', async () => {
    const signUpData: SignUpDefaultDto = {
      email: 'test@example.com',
      password: 'Password123!',
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up-default/')
      .send(signUpData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', signUpData.email);
    expect(response.body).toHaveProperty(
      'password',
      signUpData.email + signUpData.password,
    );
    expect(response.body).toHaveProperty(
      'newsletter_subscription',
      signUpData.newsletter_subscription,
    );
    expect(response.body).toHaveProperty(
      'terms_and_conditions_accepted',
      signUpData.terms_and_conditions_accepted,
    );
    expect(signUpDefaultUseCaseMock.execute).toHaveBeenCalledWith(signUpData);
  });

  it('Should return 409 when email already exists', async () => {
    const signUpData: SignUpDefaultDto = {
      email: 'existing@example.com',
      password: 'Password123!',
      newsletter_subscription: true,
      terms_and_conditions_accepted: true,
    };

    signUpDefaultUseCaseMock.execute.mockRejectedValueOnce({
      statusCode: 409,
      message: 'Unable to process request',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up-default/')
      .send(signUpData)
      .expect(409);

    expect(response.body).toHaveProperty('statusCode', 409);
    expect(response.body).toHaveProperty('message');
    expect(signUpDefaultUseCaseMock.execute).toHaveBeenCalledWith(signUpData);
  });

  afterAll(async () => {
    await app.close();
  });
});
