import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentfulGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    return (
      request?.headers['api-key'] ===
      this.configService.get('CONTENTFUL_WEBHOOK_SECRET')
    );
  }
}
