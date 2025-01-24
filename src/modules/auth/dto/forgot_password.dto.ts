import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user to forgot password',
    example: 'teste@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
