import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';
import { RolesAuth } from 'src/shared/enum/roles_auth.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAuthInfoDto } from '../dto/update_info_auth.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject()
  private readonly prismaService: PrismaService;

  public async create(
    signUpAuthDto: SignUpAuthDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth> {
    const result = await this.prismaService.auth.create({
      data: {
        ...signUpAuthDto,
        verification_code: {
          create: {
            code,
            expires_at,
          },
        },
      },
    });

    return { ...result, role: result.role as RolesAuth };
  }

  public async findOneByEmail(email: string): Promise<Auth> {
    const result = await this.prismaService.auth.findUnique({
      where: {
        email,
      },
    });

    if (!result) {
      return null;
    }

    return { ...result, role: result.role as RolesAuth };
  }

  public async updateInfoAuth(
    updateAuthInfoDto: Partial<UpdateAuthInfoDto>,
  ): Promise<Auth> {
    const result = await this.prismaService.auth.update({
      where: {
        id: updateAuthInfoDto.id,
      },
      data: updateAuthInfoDto,
    });

    return { ...result, role: result.role as RolesAuth };
  }
}
