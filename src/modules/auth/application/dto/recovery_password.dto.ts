import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RecoveryPasswordDto {
  @ApiProperty({
    description: 'Token to recover the password',
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
