import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { EntitySubjectCaslType } from 'src/common/casl/types/entity_subject_casl.type';

export interface IPermissionManagerUtil {
  validateFieldPermissions(
    role: RolesEnum,
    input: object,
    action: Action,
    entity: EntitySubjectCaslType,
  ): boolean;
}
