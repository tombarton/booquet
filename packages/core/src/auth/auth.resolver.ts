import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '@root/types';
import { LoginInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { Auth } from '@common/models';
import { User } from '@prisma/client';
import { CurrentUser } from '@common/decorators';
import { UseGuards } from '@nestjs/common';
import { GqlRefreshGuard } from '@common/guards';

@Resolver(of => Auth)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly jwtService: JwtService
  ) {}

  async authResponse(accessToken: string): Promise<Auth> {
    return {
      accessToken: this.auth.splitToken(accessToken, ['header', 'payload']),
      user: await this.auth.getUserFromToken(accessToken),
    };
  }

  @Mutation(returns => Auth)
  async signup(
    @Context() context: GraphQLContext,
    @Args('data') data: SignupInput
  ): Promise<Auth> {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);

    if (data.autoLogin) {
      await this.auth.setloginCookies({ accessToken, refreshToken }, context);
    }

    return this.authResponse(accessToken);
  }

  @Mutation(returns => Auth)
  async login(
    @Context() context: GraphQLContext,
    @Args('data') { email, password }: LoginInput
  ): Promise<Auth> {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password
    );
    await this.auth.setloginCookies({ accessToken, refreshToken }, context);

    return this.authResponse(accessToken);
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(returns => Auth)
  async refreshAccessToken(
    @Context() context: GraphQLContext,
    @CurrentUser() user: User
  ) {
    const { accessToken } = await this.auth.generateTokens(user, false);

    await this.auth.setloginCookies({ accessToken }, context);

    return this.authResponse(accessToken);
  }

  @Mutation(returns => Boolean)
  async logout(@Context() context: GraphQLContext): Promise<boolean> {
    // Delete cookies.
    await this.auth.clearLoginCookies(context);

    return true;
  }

  @Mutation(returns => Boolean)
  async forgotPassword(
    @Context() context: GraphQLContext,
    @Args('data') { email }: ForgotPasswordInput
  ): Promise<boolean> {
    // Clear login cookies in case it is persisting.
    await this.auth.clearLoginCookies(context);
    return await this.auth.forgotPassword(email.toLowerCase());
  }

  @Mutation(returns => Auth)
  async resetPassword(
    @Context() context: GraphQLContext,
    @Args('data') data: ResetPasswordInput
  ): Promise<Auth> {
    const user = await this.auth.resetPassword(data);

    const { accessToken, refreshToken } = await this.auth.generateTokens(user);

    if (data.autoLogin) {
      await this.auth.setloginCookies({ accessToken, refreshToken }, context);
    }

    return this.authResponse(accessToken);
  }
}
