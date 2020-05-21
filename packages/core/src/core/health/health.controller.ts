import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  DNSHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { DatabaseHealthIndicator } from './custom-checks/db.health';
import { RedisHealthIndicator } from './custom-checks/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private dbHealth: DatabaseHealthIndicator,
    private redisHealth: RedisHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () =>
        this.dns.pingCheck(
          'front-end',
          `https://${this.configService.get('FE_URL')}`
        ),
      () =>
        this.dns.pingCheck(
          'back-end',
          `https://${this.configService.get('BE_URL')}`
        ),
      () => this.dbHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
