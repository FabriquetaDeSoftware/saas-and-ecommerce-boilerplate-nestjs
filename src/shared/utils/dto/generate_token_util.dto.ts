import { IsEmail, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GenerateTokenUtilDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  sub: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
