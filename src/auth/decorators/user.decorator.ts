import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

export interface UserType {
  id: number;
  permissions: string[];
}

export const User = (required = true) =>
  createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user && required) {
      throw new ForbiddenException('User was not found');
    }

    return user;
  })();
