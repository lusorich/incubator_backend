import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './modules/usersModule/users.module';
import { CommonModule } from './modules/commonModule/common.module';
import { NotificationModule } from './modules/notificationModule/notifications.module';
import { appSettings } from './settings/appSettings';
import { BlogsModule } from './modules/blogsModule/blogs.module';
import { TestingModule } from './modules/testingModule/testing.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SecurityModule } from './modules/securityModule/security.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './modules/databaseModule/database.module';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      useFactory: () => ({
        host: 'localhost', // appSettings.get('POSTGRES_HOST'),
        port: 5433, // appSettings.get('POSTGRES_PORT'),
        user: 'postgres', // appSettings.get('POSTGRES_USER'),
        password: 'root', // appSettings.get('POSTGRES_PASSWORD'),
        database: 'kamasutra', //appSettings.get('POSTGRES_DB'),
      }),
    }),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    MailerModule.forRoot({
      transport: {
        service: 'Mail.ru',
        auth: {
          user: appSettings.api.MAIL_USER,
          pass: appSettings.api.MAIL_PASSWORD,
        },
      },
    }),

    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 10000, limit: 5 }],
    }),

    SwaggerModule,

    UsersModule,
    CommonModule,
    NotificationModule,
    BlogsModule,
    TestingModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
