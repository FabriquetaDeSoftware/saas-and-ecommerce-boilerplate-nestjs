import { Inject, Injectable } from '@nestjs/common';
import { IPermissionManagerUtil } from './interfaces/permission_manager.util.interface';
import { RolesEnum } from '../enum/roles.enum';
import { CaslAbilityFactory } from 'src/common/casl/casl_ability.factory';
import { Action } from '../enum/actions.enum';
import { CaslSubjectType } from 'src/common/casl/domain/types/casl_subject.type';

@Injectable()
export class PermissionManagerUtil implements IPermissionManagerUtil {
  @Inject()
  private readonly _caslAbilityFactory: CaslAbilityFactory;

  public validateFieldPermissions(
    role: RolesEnum,
    input: object,
    action: Action,
    entity: CaslSubjectType,
  ): boolean {
    const ability = this._caslAbilityFactory.createForUser(role);

    const fieldsToUpdate = Object.keys(input);
    const isAllowed = fieldsToUpdate.every((field) =>
      ability.can(action, entity, field),
    );

    return isAllowed;
  }

  public filterAllowedFields(
    role: RolesEnum,
    input: object,
    action: Action,
    entity: CaslSubjectType,
  ): Partial<CaslSubjectType> {
    const ability = this._caslAbilityFactory.createForUser(role);

    const filteredInput = Object.fromEntries(
      Object.entries(input).filter(([field]) =>
        ability.can(action, entity, field),
      ),
    );

    return filteredInput;
  }
}
