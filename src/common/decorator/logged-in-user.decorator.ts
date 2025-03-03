import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthResponseDTO } from '../../auth/dto/response/auth-response.dto';

export const LoggedInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthResponseDTO;
  },
);
