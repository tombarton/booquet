import { GqlAuthGuard } from './gql-auth.guard';
import { RolesGuard } from './role.guard';
import { GqlOptionalAuthGuard } from './gql-optional-auth.guard';
import { GqlRefreshGuard } from './gql-refresh.guard';

export { GqlAuthGuard, RolesGuard, GqlOptionalAuthGuard, GqlRefreshGuard };
export const Guards = [
  GqlAuthGuard,
  RolesGuard,
  GqlOptionalAuthGuard,
  GqlRefreshGuard,
];
