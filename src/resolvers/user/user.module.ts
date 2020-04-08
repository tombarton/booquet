import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { PrismaService } from '../../services/prisma.service';
import { PasswordService } from '../../services/password.service';

@Module({
  providers: [UserResolver, UserService, PrismaService, PasswordService],
})
export class UserModule {}
