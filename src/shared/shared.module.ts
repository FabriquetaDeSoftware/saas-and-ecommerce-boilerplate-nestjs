import { Module } from '@nestjs/common';
import { HashUtil } from './utils/hash.util';
import { GenerateTokenUtil } from './utils/generate_token.util';
import { JwtModule } from '@nestjs/jwt';
import { jwtKeysConstants } from '@src/auth/constants/jwt_keys.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtKeysConstants.secret_token_key,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [
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
  ],
  exports: ['IHashUtil', 'IGenerateTokenUtil'],
})
export class SharedModule {}
