import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
  TimeoutError,
} from '@nestjs/terminus';
import {
  promiseTimeout,
  TimeoutError as PromiseTimeoutError,
} from '@common/utils/promise-timeout';
import { PrismaService } from '@common/services';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  timeout = 400;

  constructor(private prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await promiseTimeout(
        this.timeout,
        this.prisma.product.findMany({ take: 1 })
      );
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
