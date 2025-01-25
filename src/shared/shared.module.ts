import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GenerateNumberCodeUtil } from './utils/generate_number_code.util';
import { CryptoUtil } from './utils/crypto.util';
import { HashUtil } from './utils/hash.util';
import { ProccessHtmlUtil } from './utils/proccess_html.util';

@Module({
  imports: [],
  providers: [
    ProccessHtmlUtil,
    {
      provide: 'IProccessHtmlUtil',
      useExisting: ProccessHtmlUtil,
    },
    GenerateNumberCodeUtil,
    {
      provide: 'IGenerateNumberCodeUtil',
      useExisting: GenerateNumberCodeUtil,
    },
    CryptoUtil,
    {
      provide: 'ICryptoUtil',
      useExisting: CryptoUtil,
    },
    HashUtil,
    {
      provide: 'IHashUtil',
      useExisting: HashUtil,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    'IHashUtil',
    'ICryptoUtil',
    'IGenerateNumberCodeUtil',
    'IProccessHtmlUtil',
  ],
})
export class SharedModule {}
