import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EntitySubjectCaslType } from './types/entity_subject_casl.type';

type Subjects = InferSubjects<EntitySubjectCaslType> | 'all';

type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(role: RolesEnum) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    switch (role) {
      case RolesEnum.ADMIN:
        can(Action.Manage, Products);
        break;

      default:
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
