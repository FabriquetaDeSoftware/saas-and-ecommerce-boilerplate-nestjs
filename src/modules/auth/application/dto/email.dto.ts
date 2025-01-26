import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description: 'Email of the user to execute action',
    example: 'teste1@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
