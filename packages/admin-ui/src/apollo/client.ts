import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { combinedLink } from './links';

export const createApolloClient = () =>
  new ApolloClient({
    link: combinedLink,
    cache: new InMemoryCache(),
  });
