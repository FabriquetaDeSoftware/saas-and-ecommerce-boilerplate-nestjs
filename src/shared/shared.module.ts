import { Module } from '@nestjs/common';
import { GenerateNumberCodeUtil } from './utils/generate_number_code.util';
import { CryptoUtil } from './utils/crypto.util';
import { HashUtil } from './utils/hash.util';
import { EmailModule } from './modules/email/email.module';
import { PermissionManagerUtil } from './utils/permission_manager.util';
import { CaslModule } from 'src/common/casl/casl.module';

@Module({
  imports: [EmailModule, CaslModule],
  providers: [
    PermissionManagerUtil,
    {
      provide: 'IPermissionManagerUtil',
      useExisting: PermissionManagerUtil,
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
  ],
  exports: [
    'IHashUtil',
    'ICryptoUtil',
    'IGenerateNumberCodeUtil',
    'IPermissionManagerUtil',
    EmailModule,
  ],
})
export class SharedModule {}
