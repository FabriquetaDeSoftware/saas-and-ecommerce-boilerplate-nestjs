import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDefaultDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'teste@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Accepts or not the newsletter subscription',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  newsletter_subscription: boolean;

  @ApiProperty({
    description: 'Accepts or not the terms and conditions',
    type: 'boolean',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  terms_and_conditions_accepted: boolean;
}
