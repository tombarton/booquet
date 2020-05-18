import { User } from '@common/models/user';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '@root/types';
import { LoginInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';

@Resolver(of => User)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Mutation(returns => User)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.createUser(data);

    return await this.auth.getUserFromToken(token);
  }

  @Mutation(returns => User)
  async login(
    @Context() context: GraphQLContext,
    @Args('data') { email, password }: LoginInput
  ) {
    const token = await this.auth.login(email.toLowerCase(), password);
    await this.auth.setloginCookies(token, context);

    return await this.auth.getUserFromToken(token);
  }

  @Mutation(returns => Boolean)
  async logout(@Context() context: GraphQLContext) {
    // Delete cookies.
    await this.auth.clearLoginCookies(context);

    return true;
  }

  @Mutation(returns => Boolean)
  async forgotPassword(@Args('data') { email }: ForgotPasswordInput) {
    return await this.auth.forgotPassword(email.toLowerCase());
  }

  @Mutation(returns => User)
  async resetPassword(
    @Context() context: GraphQLContext,
    @Args('data') payload: ResetPasswordInput
  ) {
    const user = await this.auth.resetPassword(payload);

    if (payload.autoLogin) {
      const token = this.jwtService.sign({ userId: user.id });
      await this.auth.setloginCookies(token, context);
    }

    return user;
  }
}
