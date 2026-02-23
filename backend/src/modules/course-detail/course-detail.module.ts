import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDetailService } from './course-detail.service';
import { CourseDetailController } from './course-detail.controller';

// ─── ENTITIES ──────────────────────────────
import { Course } from '../../common/entities/course.entity';
import { Module as CourseModule } from '../../common/entities/module.entity';
import { Lesson } from '../../common/entities/lesson.entity';
import { LessonResource } from '../../common/entities/lesson_resources.entity';
import { User } from '../../common/entities/user.entity';
import { LessonProgress } from '../../common/entities/lesson_progress.entity';
import { CourseProgress } from '../../common/entities/course_progress.entity';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      CourseModule,
      Lesson,
      LessonResource,
      LessonProgress,
      CourseProgress,
      StudentActivityLog
    ]),
  ],
  controllers: [CourseDetailController],
  providers: [CourseDetailService],
})
export class CourseDetailModule {}