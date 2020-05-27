import { onError } from 'apollo-link-error';
import { browserHistory } from '../../utils/history';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}}`
      );

      // Redirect to login page if the request is unauthorized.
      if ([401, 403].includes(extensions?.exception?.response?.statusCode)) {
        return browserHistory.push('/login');
      }
    });
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
