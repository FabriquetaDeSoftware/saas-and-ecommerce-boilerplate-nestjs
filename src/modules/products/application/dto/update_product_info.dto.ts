import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProductInfoDto {
  @ApiProperty({
    description: 'New name of the product',
    example: 'new product name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'New description of the product',
    example: 'new the best product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'New price of the product in cents',
    example: 54321,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'New slug of the product',
    example: 'new_slug_product1',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'New url image of the product',
    example:
      'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
