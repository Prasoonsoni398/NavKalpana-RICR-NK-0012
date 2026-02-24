import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from '../../common/entities/course.entity';
import { Enrollment } from 'src/common/entities/enrollment.entity';
import { User } from 'src/common/entities/user.entity';
import { ClassSession } from 'src/common/entities/class-session.entity';
import { AttendanceRecord } from 'src/common/entities/attendance-record.entity';
import { LessonResource } from 'src/common/entities/lesson_resources.entity';
import { LessonProgress } from 'src/common/entities/lesson_progress.entity';
import { Lesson } from 'src/common/entities/lesson.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment, User, ClassSession, AttendanceRecord, LessonResource,LessonProgress, Lesson]), 
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService], 
})
export class CourseModule {}