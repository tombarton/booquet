import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { combinedLink } from './links';

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    link: combinedLink,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
