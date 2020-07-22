import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import { errorLink } from './error';
import { authLink } from './http';
import { retryLink } from './retry';
import { wsLink } from './ws';

export const combinedLink = ApolloLink.from([errorLink, retryLink]).split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink
);
