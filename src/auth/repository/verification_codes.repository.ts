import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerificationCodes } from '../entities/verification_codes.entity';
import { IVerificationCodesRepository } from '../interfaces/repository/verification_codes.repository.interface';

@Injectable()
export class VerificationCodesRepository
  implements IVerificationCodesRepository
{
  @Inject()
  private readonly prismaService: PrismaService;

  public async findVerificationCodeByEmail(
    auth_id: number,
  ): Promise<VerificationCodes> {
    const result = await this.prismaService.verificationCodes.findUnique({
      where: { auth_id },
    });

    return result;
  }
}
