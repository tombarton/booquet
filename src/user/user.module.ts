import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { SharedServices } from '@common/services';

@Module({
  imports: [SharedServices],
  providers: [UserResolver, UserService],
})
export class UserModule {}
