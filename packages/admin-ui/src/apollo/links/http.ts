import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import AuthService from '../../services/auth';

// Create an http link:
const httpLink = new HttpLink({
  // @TODO: Move this to an environment variable.
  uri: `http://localhost:4000/graphql`,
  credentials: 'include',
});

// Add Bearer token to header.
export const authLink = setContext((_, { headers }) => {
  const token = AuthService.getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
}).concat(httpLink);
