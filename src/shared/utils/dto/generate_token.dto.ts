import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TokenEnum } from 'src/shared/enum/token.enum';

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

  @IsOptional()
  @IsEnum(TokenEnum)
  type?: TokenEnum;
}
