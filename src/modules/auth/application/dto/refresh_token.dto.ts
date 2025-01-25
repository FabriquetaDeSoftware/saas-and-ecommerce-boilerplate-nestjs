import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token of the user',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
