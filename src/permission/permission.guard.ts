import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/public.decorator';
import { Permission } from './permission.enum';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
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

    const reqPerms = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!reqPerms) {
      return true;
    }
    const { user } = ctx.switchToHttp().getRequest();
    return reqPerms.some((permission) => user.permissions === permission);
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
