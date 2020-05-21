import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SharedServices } from '@root/common/services';
import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './custom-checks/db.health';
import { RedisHealthIndicator } from './custom-checks/redis.health';

@Module({
  imports: [TerminusModule, SharedServices],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
