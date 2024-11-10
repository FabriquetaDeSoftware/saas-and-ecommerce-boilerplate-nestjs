import { ApiProperty } from '@nestjs/swagger';
import { RolesAuth } from '@src/shared/enum/roles_auth.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpAuthDto {
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
    description: 'Role of the user',
    enum: RolesAuth,
    example: RolesAuth.USER,
  })
  @IsNotEmpty()
  @IsEnum(RolesAuth)
  role: RolesAuth;
}
