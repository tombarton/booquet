import Joi from 'joi';

export type ConfigSchema = {
  // General
  PORT: number;
  FE_URL: string;
  BE_URL: string;

  // Prisma
  PRISMA_DB_URL: string;

  // GraphQL
  GRAPHQL_SCHEMA_PATH: string;
  GRAPHQL_DEBUG_ENABLED: number;
  GRAPHQL_PLAYGROUND_ENABLED: number;

  // Security
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  REFRESH_SECRET: string;
  REFRESH_EXPIRY: string;
  BCRYPT_SALT_OR_ROUNDS: number;

  // Email
  POSTMARK_KEY: string;
  EMAIL_FROM_ADDRESS: string;

  // Contentful
  CONTENTFUL_SPACE: string;
  CONTENTFUL_ENVIRONMENT: string;
  CONTENTFUL_MANAGEMENT_TOKEN: string;
  CONTENTFUL_ACCESS_TOKEN: string;
  CONTENTFUL_WEBHOOK_SECRET: string;

  // Stripe
  STRIPE_API_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
};

export const configValidationSchema = Joi.object<ConfigSchema>({
  // General
  PORT: Joi.number().default(4000),
  FE_URL: Joi.string().default('http://google.com'),
  BE_URL: Joi.string().default('http://google.com'),

  // Prisma
  PRISMA_DB_URL: Joi.string().required(),

  // GraphQL
  GRAPHQL_SCHEMA_PATH: Joi.string().default('./schema.graphql'),
  GRAPHQL_DEBUG_ENABLED: Joi.number().default(0),
  GRAPHQL_PLAYGROUND_ENABLED: Joi.number().default(0),

  // Security
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().default('5m'),
  REFRESH_SECRET: Joi.string().required(),
  REFRESH_EXPIRY: Joi.string().default('1w'),
  BCRYPT_SALT_OR_ROUNDS: Joi.number().default(10),

  // Email
  POSTMARK_KEY: Joi.string().required(),
  EMAIL_FROM_ADDRESS: Joi.string().required(),

  // Contentful
  CONTENTFUL_SPACE: Joi.string().required(),
  CONTENTFUL_ENVIRONMENT: Joi.string().required(),
  CONTENTFUL_MANAGEMENT_TOKEN: Joi.string().required(),
  CONTENTFUL_ACCESS_TOKEN: Joi.string().required(),
  CONTENTFUL_WEBHOOK_SECRET: Joi.string().required(),

  // Stripe
  STRIPE_API_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
