import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Auth } from 'src/modules/auth/domain/entities/auth.entity';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';

export type ProductFields = keyof Products;

type Subjects = InferSubjects<typeof Products | typeof Auth> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(role: RolesEnum) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);

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
