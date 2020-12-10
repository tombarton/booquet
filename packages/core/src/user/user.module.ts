import { Module } from '@nestjs/common';
import { SharedServices } from '@common/services';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [SharedServices],
  providers: [UserResolver, UserService],
})
export class UserModule {}
