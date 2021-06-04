import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}
}
