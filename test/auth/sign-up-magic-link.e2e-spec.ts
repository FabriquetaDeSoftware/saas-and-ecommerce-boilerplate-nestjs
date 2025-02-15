import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISignUpMagicLinkUseCase } from 'src/modules/auth/domain/interfaces/use_cases/sign_up_magic_link.use_case.interface';
import { SignUpMagicLinkUseCase } from 'src/modules/auth/application/use_cases/sign_up_magic_link.use_case';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let signUpMagicLinkUseCaseMock: jest.Mocked<ISignUpMagicLinkUseCase>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    signUpMagicLinkUseCaseMock = {
      execute: jest.fn().mockImplementation((dto: SignUpMagicLinkDto) => {
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
      .overrideProvider(SignUpMagicLinkUseCase)
      .useValue(signUpMagicLinkUseCaseMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/sign-up-magic-link/ (Post)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up-magic-link/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
