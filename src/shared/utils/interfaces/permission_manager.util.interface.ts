import { Action } from 'src/shared/enum/actions.enum';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { CaslSubjectType } from 'src/common/casl/domain/types/casl_subject.type';

export interface IPermissionManagerUtil {
  validateFieldPermissions(
    role: RolesEnum,
    input: object,
    action: Action,
    entity: CaslSubjectType,
  ): boolean;
}
