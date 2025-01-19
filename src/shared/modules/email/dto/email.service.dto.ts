import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailServiceDto {
  @ApiProperty({
    description: 'Name the person who will receive the email',
    example: 'cezar',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email the person who will receive the email',
    example: 'emailtest@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Code to be sent in the email',
    example: 123456,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
