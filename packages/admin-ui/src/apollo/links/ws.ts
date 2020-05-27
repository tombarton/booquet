import { WebSocketLink } from 'apollo-link-ws';

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
  // @TODO: Move this to an environment variable.
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});
