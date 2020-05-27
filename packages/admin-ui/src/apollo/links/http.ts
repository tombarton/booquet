import { HttpLink } from 'apollo-link-http';

// Create an http link:
export const httpLink = new HttpLink({
  // @TODO: Move this to an environment variable.
  uri: `http://localhost:4000/graphql`,
  credentials: 'include',
});
