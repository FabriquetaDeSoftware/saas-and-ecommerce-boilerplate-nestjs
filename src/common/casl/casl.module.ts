import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl_ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
