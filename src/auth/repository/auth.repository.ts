import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '@auth/interfaces/repository/auth.repository.interface';
import { Auth } from '@auth/entities/auth.entity';
import { PrismaService } from '@src/shared/prisma/prisma.service';
import { SignUpAuthDto } from '@auth/dto/sign_up_auth.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  public async create(signUpAuthDto: SignUpAuthDto): Promise<Auth> {
    const result = await this.prismaService.auth.create({
      data: signUpAuthDto,
    });

    return result;
  }

  public async findOneByEmail(email: string): Promise<Auth> {
    const result = await this.prismaService.auth.findUnique({
      where: {
        email,
      },
    });

    return result;
  }
}
