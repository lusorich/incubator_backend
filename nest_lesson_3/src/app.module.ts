import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/usersModule/users.module';
import { CommonModule } from './modules/commonModule/common.module';
import { NotificationModule } from './modules/notificationModule/notifications.module';
import { appSettings } from './settings/appSettings';
import { BlogsModule } from './modules/blogsModule/blogs.module';

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

    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_JWT_KEY,
      signOptions: { expiresIn: '5m' },
    }),
    UsersModule,
    CommonModule,
    NotificationModule,
    BlogsModule,
  ],
  controllers: [
    //    TestingController,
  ],
  providers: [],
})
export class AppModule {}
