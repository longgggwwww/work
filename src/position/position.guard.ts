import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/public.decorator';
import { POSITION_KEY } from './position.decorator';
import { Position } from './position.enum';

@Injectable()
export class PositionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic || this.checkApiKey(ctx)) {
      return true;
    }

    const reqPerms = this.reflector.getAllAndOverride<Position[]>(
      POSITION_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!reqPerms) {
      return true;
    }
    const {
      body: { companyId },
    } = ctx.switchToHttp().getRequest<Request>();
    // return reqPerms.some((position) =>
    //   user.permissions.some((perm: string) => perm === position),
    // );
    console.log('debug', companyId);
    return false;
  }

  checkApiKey(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] ?? req.query.api_key;
    const apiKey = this.configService.get<string>('API_KEY');
    if (key && apiKey === key) {
      return true;
    }
    return false;
  }
}
