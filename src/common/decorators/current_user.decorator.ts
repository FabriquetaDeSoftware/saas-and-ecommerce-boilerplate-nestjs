import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    const user: IJwtUserPayload = ctx.user;

    return user;
  },
);
