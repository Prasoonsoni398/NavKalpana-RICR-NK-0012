// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './common/database/database.module';
import { MailModule } from './common/config/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { CourseDetailModule } from './modules/course-detail/course-detail.module';
import mailConfig from './common/config/mail/mail.config'; // ✅ import the mail config

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig], // ✅ load your mail config namespace
    }),

    DatabaseModule,
    MailModule,
    UsersModule,
    AuthModule,
    CourseModule,
    AssignmentModule,
    CourseDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
