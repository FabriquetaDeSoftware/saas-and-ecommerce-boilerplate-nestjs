import { Module } from '@nestjs/common';
import { HashUtil } from './utils/hash.util';
import { GenerateTokenUtil } from './utils/generate_token.util';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';
import { CryptoUtil } from './utils/crypto.util';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtKeysConstants.secret_token_key,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [
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
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: ['IHashUtil', 'IGenerateTokenUtil', 'ICryptoUtil', JwtModule],
})
export class SharedModule {}
