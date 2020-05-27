import { RetryLink } from 'apollo-link-retry';

const UNAUTHORIZED = 401;

export const retryLink = new RetryLink({
  delay: {
    initial: 0,
    max: 1000,
  },
  attempts: {
    max: 3,
    retryIf: (error: Error) => (error as any)?.statusCode === UNAUTHORIZED,
  },
});
