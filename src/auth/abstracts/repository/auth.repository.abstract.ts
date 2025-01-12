import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class AuthRepositoryAbstract {
  @Inject()
  protected readonly prismaService: PrismaService;
}
