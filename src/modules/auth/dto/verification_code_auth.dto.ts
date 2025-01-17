import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class VerificationCodeAuthDto {
  @ApiProperty({
    description: 'Email of the user to verify account',
    example: 'teste@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
