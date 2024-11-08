import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenUtilDto {
  @IsNotEmpty()
  @IsString()
  sub: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
