import { GqlAuthGuard } from './gql-auth.guard';
import { RolesGuard } from './role.guard';
import { GqlOptionalAuthGuard } from './gql-optional-auth.guard';

export { GqlAuthGuard, RolesGuard, GqlOptionalAuthGuard };
export const Guards = [GqlAuthGuard, RolesGuard, GqlOptionalAuthGuard];
