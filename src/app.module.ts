import { HealthController } from '@/app/presentation/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { TodoModule } from '@/todo/todo.module';
import { GraphQLExceptionFilter } from '@/utils/filters/exception.filter';
import { LoggingInterceptor } from '@/utils/interceptor/api.interceptor';
import { LoggerModule } from '@/utils/logger/logger.module';
import { SlackNotificationService } from '@/utils/slack/slack.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    LoggerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      isGlobal: true,
    }),
    AuthModule,
    TodoModule,
  ],
  controllers: [HealthController],
  providers: [
    SlackNotificationService,
    {
      provide: 'APP_FILTER',
      useClass: GraphQLExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
