import { CorsOptions } from 'cors';

export const GQL_CONFIG = {
  schemaPath: './src/schema.graphql',
  playgroundConfig: {
    settings: {
      'request.credentials': 'include',
    },
  },
};

export const CORS_CONFIG: CorsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

export const isEnabled = (enabled: string): boolean => {
  return enabled === '1';
};
