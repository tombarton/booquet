import { onError } from 'apollo-link-error';
import { browserHistory } from '../../utils/history';

export const errorLink = onError(
  ({ graphQLErrors, networkError, operation }) => {
    console.log(operation.operationName);
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        // TODO: This is where we'll do token refreshes. We can grab the status
        // code via `extensions?.exception.status`. There's certain operations that
        // we want to ignore refresh requests for (e.g. login) so we will check the
        // operation name for that.
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}}`
        );

        // Redirect to login page if the request is unauthorized.
        // TODO: We should only execute this after attempting to refresh the
        // access token
        if ([401, 403].includes(extensions?.exception?.response?.statusCode)) {
          return browserHistory.push('/login');
        }
      });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);
