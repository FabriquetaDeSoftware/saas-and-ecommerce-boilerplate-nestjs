import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Auth } from '../entities/auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  async create(signUpAuthDto: SignUpAuthDto): Promise<Auth> {
    const result = await this.prismaService.auth.create({
      data: signUpAuthDto,
    });

    return result;
  }

  async findOneByEmail(email: string): Promise<Auth> {
    const result = await this.prismaService.auth.findUnique({
      where: {
        email,
      },
    });

    return result;
  }

  async findOneByl(email: string): Promise<Auth> {
    const result = await this.prismaService.auth.findUnique({
      where: {
        email,
      },
    });

    return result;
  }
}
