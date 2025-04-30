import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateInfoDto {
  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Verify if the account is verified',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsOptional()
  is_verified_account: boolean;

  @ApiProperty({
    description: 'Accepts or not the newsletter subscription',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  newsletter_subscription: boolean;
}
