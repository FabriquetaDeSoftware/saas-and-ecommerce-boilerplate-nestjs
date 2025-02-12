import { ForbiddenException } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { serverConstants } from 'src/shared/constants/server.constant';

export function corsConfig(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  const host = serverConstants.host;
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || host.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
  });
}
