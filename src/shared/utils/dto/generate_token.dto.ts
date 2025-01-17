import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsNotEmpty()
  @IsString()
  sub: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
