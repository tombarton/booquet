import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { User, Role } from '../models/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles || !roles.length) return true;

    const ctx = GqlExecutionContext.create(context);
    const { role: userRole } = ctx.getContext().req.user as User;

    return roles.includes(userRole);
  }
}
