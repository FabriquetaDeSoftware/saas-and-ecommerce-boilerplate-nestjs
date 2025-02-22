import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TypeProductEnum } from '../enum/type_product.enum';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductDto {
  @ApiProperty({
    description: 'Type of product',
    example: TypeProductEnum.SUBSCRIPTION,
    enum: TypeProductEnum,
    enumName: 'TypeProductEnum',
  })
  @IsNotEmpty()
  @IsEnum(TypeProductEnum)
  type: TypeProductEnum;

  @IsNotEmpty()
  @IsUUID()
  public_id: string;
}
