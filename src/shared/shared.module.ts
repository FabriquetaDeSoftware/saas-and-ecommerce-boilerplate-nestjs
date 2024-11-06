import { Module } from '@nestjs/common';
import { HashUtil } from './utils/hash.util';

@Module({
  providers: [
    HashUtil,
    {
      provide: 'IHashUtil',
      useExisting: HashUtil,
    },
  ],
  exports: ['IHashUtil'],
})
export class SharedModule {}
