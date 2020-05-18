import { Injectable, Inject } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
  TimeoutError,
} from '@nestjs/terminus';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  promiseTimeout,
  TimeoutError as PromiseTimeoutError,
} from '@common/utils/promise-timeout';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  timeout = 250;

  constructor(@Inject('PubSub') private readonly pubSub: RedisPubSub) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const redisClient = this.pubSub.getPublisher();
      await promiseTimeout(this.timeout, redisClient.ping('Health Check'));
      return this.getStatus(key, true);
    } catch (err) {
      if (err instanceof PromiseTimeoutError) {
        throw new TimeoutError(
          this.timeout,
          this.getStatus(key, false, {
            message: `Timeout of ${this.timeout} ms exceeded`,
          })
        );
      }
      throw new HealthCheckError('Database check failed.', err);
    }
  }
}
