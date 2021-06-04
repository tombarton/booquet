import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ContentfulModule } from '@root/contentful/contentful.module';
import { StripeModule } from '@root/stripe/stripe.module';
import { ProductsModule } from '@root/products/products.module';
import { AuthModule } from '@root/auth/auth.module';
import { UserModule } from '@root/user/user.module';
import { HealthModule } from '@core/health/health.module';
import { RawBodyMiddleware } from '@root/core/middleware/raw-body.middleware';
import { JsonBodyMiddleware } from '@root/core/middleware/json-body.middleware';
import { isEnabled, GQL_CONFIG, CORS_CONFIG } from '@core/config';
import { AUTH_HEADER } from '@root/auth/strategies';
import { NestGraphQLConnectionParams, NestGraphQLWebSocket } from './types';
import { ConfigModule } from './config/config.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: GQL_CONFIG.schemaPath,
        installSubscriptionHandlers: true,
        debug: isEnabled(configService.get('GRAPHQL_DEBUG_ENABLED')),
        playground: isEnabled(configService.get('GRAPHQL_PLAYGROUND_ENABLED'))
          ? GQL_CONFIG.playgroundConfig
          : false,
        // Set CORS here as well as it overrides root CORS settings.
        cors: CORS_CONFIG,
        context: ({ req, res, payload, connection }) => ({
          req,
          res,
          payload,
          connection,
        }),
        subscriptions: {
          onConnect: (
            connectionParams: NestGraphQLConnectionParams,
            websocket: NestGraphQLWebSocket
          ) => {
            const { Authorization } = connectionParams;

            return {
              headers: {
                ...websocket?.upgradeReq?.headers,
                [AUTH_HEADER]: Authorization,
              },
            };
          },
        },
      }),
      inject: [ConfigService],
    }),
    ContentfulModule,
    StripeModule,
    ProductsModule,
    AuthModule,
    UserModule,
    HealthModule,
    DeliveryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes('stripe/webhook')
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
