import { LoginInput } from './dto/login.input';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../../services/auth.service';
import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '../../types';
import { User } from '../../models/user';

@Resolver(of => User)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

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
    const [header, payload, signature] = token.split('.');

    // Set signature httpOnly cookie.
    // TODO: Need to set secure mode in production...
    context.res.cookie('signature', signature, {
      httpOnly: true,
    });

    // Set remainder of JWT as a standard cookie, accessible via JS.
    context.res.cookie('partialJwt', `${header}.${payload}`);

    return await this.auth.getUserFromToken(token);
  }
}
