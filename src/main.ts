import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { serverConstants } from './shared/constants/server.constant';
import { swaggerConfig } from './config/swagger.config';
import { corsConfig } from './config/cors.config';
import { renderPageConfig } from './config/render_page.config';

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
      transform: true,
    }),
  );

  renderPageConfig(app);

  corsConfig(app);

  swaggerConfig(app);

  const port = parseInt(serverConstants.port_api);
  await app.listen({ port, host: '0.0.0.0' });
}
bootstrap();
