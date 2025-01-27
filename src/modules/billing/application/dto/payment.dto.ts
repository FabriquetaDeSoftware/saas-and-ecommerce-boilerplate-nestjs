import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentsEnum } from 'src/modules/auth/application/enum/payments.enum';

export class PaymentDto {
  @ApiProperty({
    description: 'Payment type',
    example: PaymentsEnum.SUBSCRIPTION,
    enum: PaymentsEnum,
    enumName: 'PaymentsEnum',
  })
  @IsNotEmpty()
  @IsEnum(PaymentsEnum)
  type: PaymentsEnum;
}
