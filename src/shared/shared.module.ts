import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GenerateCodeOfVerificationUtil } from './utils/generate_code_of_verification.util';
import { CryptoUtil } from './utils/crypto.util';
import { GenerateTokenUtil } from './utils/generate_token.util';
import { HashUtil } from './utils/hash.util';
import { EmailModule } from './modules/email/email.module';
import { ProccessHtmlUtil } from './utils/proccess_html.util';

@Module({
  imports: [forwardRef(() => AuthModule), EmailModule],
  providers: [
    ProccessHtmlUtil,
    {
      provide: 'IProccessHtmlUtil',
      useExisting: ProccessHtmlUtil,
    },
    GenerateCodeOfVerificationUtil,
    {
      provide: 'IGenerateCodeOfVerificationUtil',
      useExisting: GenerateCodeOfVerificationUtil,
    },
    CryptoUtil,
    {
      provide: 'ICryptoUtil',
      useExisting: CryptoUtil,
    },
    GenerateTokenUtil,
    {
      provide: 'IGenerateTokenUtil',
      useExisting: GenerateTokenUtil,
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
    'IGenerateTokenUtil',
    'ICryptoUtil',
    'IGenerateCodeOfVerificationUtil',
    'IProccessHtmlUtil',
    EmailModule,
  ],
})
export class SharedModule {}
