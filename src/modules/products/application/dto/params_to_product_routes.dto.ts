import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TypeProductEnum } from '../enum/type_product.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TypeProductParamsDto {
  @ApiProperty({
    description: 'Type of product',
    example: TypeProductEnum.SUBSCRIPTION,
    enum: TypeProductEnum,
    enumName: 'TypeProductEnum',
  })
  @IsNotEmpty()
  @IsEnum(TypeProductEnum)
  type: TypeProductEnum;
}

export class TypeAndIdProductParamsDto extends TypeProductParamsDto {
  @ApiProperty({
    description: 'Public id of the product',
    example: 'f1b9d1c4-0c8f-4e6c-8c5c-1e0c7f8e1b8a',
  })
  @IsNotEmpty()
  @IsUUID()
  public_id: string;
}
