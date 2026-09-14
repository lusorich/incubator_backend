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

@Module({
  imports: [
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
