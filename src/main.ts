import './config/tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { swaggerConfig } from './config/swagger.config';
import { corsConfig } from './config/cors.config';
import { renderPageConfig } from './config/render_page.config';
import { EnvService } from './common/modules/services/env.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 10_485_760,
      connectionTimeout: 15_000,
    }),
    {
      rawBody: true,
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const envService = app.get(EnvService);

  renderPageConfig(app);

  corsConfig(app);

  swaggerConfig(app);

  const port = envService.portApi;
  await app.listen({ port, host: '0.0.0.0' });
}
bootstrap();
