import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';

export class VerificationCodeAuthDto {
  @ApiProperty({
    description: 'Code to verify new user account',
    example: '123456',
  })
  @IsNotEmpty()
  @Min(100000)
  @Max(999999)
  @IsPositive()
  @IsInt()
  code: number;
}
