import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LanguageEnum } from 'src/shared/enum/language.enum';
import { TemplateEnum } from '../enum/template.enum';

export class EmailServiceDto {
  @ApiProperty({
    description: 'Email the person who will receive the email',
    example: 'emailtest@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  emailTo: string;

  @ApiProperty({
    description: 'Subject of the email',
    example: 'Test email',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Language of the email',
    enum: LanguageEnum,
    example: LanguageEnum.PT_BR,
  })
  @IsNotEmpty()
  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @ApiProperty({
    description: 'Template of the email',
    enum: TemplateEnum,
    example: TemplateEnum.ACCOUNT_VERIFICATION,
  })
  @IsNotEmpty()
  @IsEnum(TemplateEnum)
  template: TemplateEnum;
}
