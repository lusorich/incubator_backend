import { Module } from '@nestjs/common';
import { TestingController } from './controller/testing.controller';
import { BlogsModule } from '../blogsModule/blogs.module';
import { UsersModule } from '../usersModule/users.module';
import { SecurityModule } from '../securityModule/security.module';

@Module({
  imports: [BlogsModule, UsersModule, SecurityModule],
  controllers: [TestingController],
  providers: [],
  exports: [],
})
export class TestingModule {}
