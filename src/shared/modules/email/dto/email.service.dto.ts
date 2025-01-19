import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailServiceDto {
  @ApiProperty({
    description: 'Name',
    example: 'cezar',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
