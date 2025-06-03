import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class SignInOneTimePasswordDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'teste@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'One Time Password of the user',
    example: '123456',
  })
  @IsNotEmpty()
  @Min(100000)
  @Max(999999)
  @IsPositive()
  @IsInt()
  password: string;
}
