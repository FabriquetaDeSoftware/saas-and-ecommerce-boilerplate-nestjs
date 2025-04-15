import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    description: 'Public id of the product',
    example: 'f1b9d1c4-0c8f-4e6c-8c5c-1e0c7f8e1b8a',
  })
  @IsNotEmpty()
  @IsUUID()
  public_id: string;
}
