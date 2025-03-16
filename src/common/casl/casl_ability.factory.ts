import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { CaslSubjectType } from './domain/types/casl_subject.type';
import { CaslEntities } from './domain/entities/casl_entities.entity';

type Subjects = InferSubjects<CaslSubjectType> | 'all';

type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(role: RolesEnum) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    switch (role) {
      case RolesEnum.ADMIN:
        can(Action.Manage, CaslEntities.Products);
        break;

      case RolesEnum.USER:
        cannot(Action.Create, CaslEntities.Products);
        cannot(Action.Delete, CaslEntities.Products);
        cannot(Action.Read, CaslEntities.Products);
        cannot(Action.Update, CaslEntities.Products);
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
