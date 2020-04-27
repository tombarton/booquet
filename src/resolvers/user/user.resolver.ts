import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from '../../models/user';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../decorators/user.decorator';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from '../../models/user';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../../guards/role.guard';

@Resolver(of => User)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('data') newUserdata: UpdateUserInput
  ) {
    return this.userService.updateUser(user.id, newUserdata);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => User)
  async changePassword(
    @CurrentUser() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @Query(returns => [User])
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
