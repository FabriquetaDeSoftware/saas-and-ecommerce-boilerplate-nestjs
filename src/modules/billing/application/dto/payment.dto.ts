import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentsEnum } from 'src/modules/auth/application/enum/payments.enum';

export class PaymentDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 10,
  })
  @IsNotEmpty()
  amount: number;

  currency?: string;
}
