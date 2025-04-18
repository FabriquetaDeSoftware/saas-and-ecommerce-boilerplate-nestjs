import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActionEnum } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { CaslSubjectType } from './domain/types/casl_subject.type';
import { CaslEntities } from './domain/entities/casl_entities.entity';

type Subjects = InferSubjects<CaslSubjectType> | 'all';

type AppAbility = MongoAbility<[ActionEnum, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(role: RolesEnum) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    switch (role) {
      case RolesEnum.ADMIN:
        can(ActionEnum.Manage, CaslEntities.Products);
        break;

      case RolesEnum.USER:
        cannot(ActionEnum.Create, CaslEntities.Products);
        cannot(ActionEnum.Delete, CaslEntities.Products);
        cannot(ActionEnum.Read, CaslEntities.Products);
        cannot(ActionEnum.Update, CaslEntities.Products);
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
