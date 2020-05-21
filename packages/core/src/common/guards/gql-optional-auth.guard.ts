import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

@Injectable()
export class GqlOptionalAuthGuard extends AuthGuard('optional') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<User>(err: Error, user: User) {
    if (!user || err) {
      return null;
    }

    return user;
  }
}
