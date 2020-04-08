import { Auth } from '../../models/auth';
import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { AuthService } from '../../services/auth.service';
import { SignupInput } from './dto/signup.input';
import { GraphQLContext } from '../../types';

@Resolver(of => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(returns => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.createUser(data);

    return {
      token,
    };
  }

  @Mutation(returns => Auth)
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

    // Setting this as a cookie for the time being. Not 100% whether to
    // allow the FE to set the cookie but don't think it matters too much.
    context.res.cookie('partialJwt', `${header}.${payload}`);

    // Only return the partial JWT for security purposes.
    return {
      token: `${header}.${payload}`,
    };
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.token);
  }
}
