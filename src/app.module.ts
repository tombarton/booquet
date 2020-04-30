import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './controllers/health/health.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './resolvers/auth/auth.module';
import { UserModule } from './resolvers/user/user.module';
import { ContentfulModule } from './controllers/contentful/contentful.module';

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
  ],
  controllers: [HealthController],
})
export class AppModule {}
