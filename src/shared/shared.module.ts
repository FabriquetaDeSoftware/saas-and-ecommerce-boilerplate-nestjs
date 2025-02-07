import { Module } from '@nestjs/common';
import { GenerateNumberCodeUtil } from './utils/generate_number_code.util';
import { CryptoUtil } from './utils/crypto.util';
import { HashUtil } from './utils/hash.util';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [
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
  ],
  exports: ['IHashUtil', 'ICryptoUtil', 'IGenerateNumberCodeUtil', EmailModule],
})
export class SharedModule {}
