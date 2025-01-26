import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpMagicLinkDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'teste@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
