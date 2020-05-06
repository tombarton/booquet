import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './controllers/health/health.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './resolvers/auth/auth.module';
import { UserModule } from './resolvers/user/user.module';
import { PaymentsModule } from './resolvers/payments/payments.module';
import { ContentfulModule } from './controllers/contentful/contentful.module';
import { StripeWebhookModule } from './controllers/stripe-webhook/stripe-webhook.module';
import { JsonBodyMiddleware } from './middleware/json-body.middleware';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug:
          configService.get('GRAPHQL_DEBUG_ENABLED') === '1' ? true : false,
        playground: configService.get('GRAPHQL_PLAYGROUND_ENABLED')
          ? {
              settings: {
                'request.credentials': 'include',
              },
            }
          : false,
        context: ({ req, res }) => ({ req, res }),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ContentfulModule,
    PaymentsModule,
    StripeWebhookModule,
    JsonBodyMiddleware,
    RawBodyMiddleware,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  // Apply Raw Body middleware to the stripe webhook
  // so we can verify the sender signature.
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes('stripe/webhook')
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
