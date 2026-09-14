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

    SwaggerModule,

    UsersModule,
    CommonModule,
    NotificationModule,
    BlogsModule,
    TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
