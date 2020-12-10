import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { UseGuards, Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { User } from '@common/models/user';
import { GqlAuthGuard } from '@common/guards/gql-auth.guard';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/role.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { ChangePasswordInput } from './dto/change-password.input';

@Resolver(of => User)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UserResolver {
  constructor(
    @Inject('PubSub') private readonly pubSub: RedisPubSub,
    private readonly userService: UserService
  ) {}

  @Query(returns => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Mutation(returns => User)
  async updateuser(
    @CurrentUser() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    const updatedUser = await this.userService.updateUser(user.id, newUserData);

    this.pubSub.publish('UPDATE_USER', {
      UPDATE_USER: updatedUser,
    });

    return updatedUser;
  }

  @Mutation(returns => User)
  async changePassword(
    @CurrentUser() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return await this.userService.changePassword(user, changePassword);
  }

  // @TODO: Remove this, it just tests the role guard.
  @Roles(Role.ADMIN)
  @Query(returns => [User])
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // @TODO: Remove this, it just serves as an example of how to do
  // GraphQL subscription.
  @Subscription(returns => User, { name: 'UPDATE_USER' })
  watchUserUpdates() {
    return this.pubSub.asyncIterator('UPDATE_USER');
  }
}
