import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { DatabaseHealthIndicator } from './custom-checks/db.health';
import { RedisHealthIndicator } from './custom-checks/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private dbHealth: DatabaseHealthIndicator,
    private redisHealth: RedisHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    const FE_URL = this.configService.get<string>('FE_URL');
    const BE_URL = this.configService.get<string>('BE_URL');

    return this.health.check([
      () => this.http.pingCheck('front-end', `https://${FE_URL}`),
      () => this.http.pingCheck('back-end', `https://${BE_URL}`),
      () => this.dbHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
