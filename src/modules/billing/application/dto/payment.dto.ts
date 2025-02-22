import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 10,
  })
  @IsNotEmpty()
  amount: number;

  currency?: string;
}
