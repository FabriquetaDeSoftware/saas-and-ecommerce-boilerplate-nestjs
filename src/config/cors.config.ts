import { ForbiddenException } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';

export function corsConfig(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  const host: string[] = [
    '0.0.0.0',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:3003',
  ];

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
