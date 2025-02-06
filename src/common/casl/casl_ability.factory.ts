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

class User {
  id: number;
  isAdmin: boolean;
}
class Article {
  id: number;
  isPublished: boolean;
  authorId: number;
}

// TODO: importar as entidades das tabela que vao se aplicar as regras
type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

//type Subjects = 'Product' | 'User' | 'Order' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    can(Action.Update, Article, { authorId: user.id });
    cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
