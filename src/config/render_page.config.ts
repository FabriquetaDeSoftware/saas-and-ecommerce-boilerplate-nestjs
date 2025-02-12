import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { join } from 'node:path';

export function renderPageConfig(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  app.useStaticAssets({
    root: join(__dirname, '../..', 'public'),
    prefix: '/public/',
  });

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '../..', 'views'),
  });
}
