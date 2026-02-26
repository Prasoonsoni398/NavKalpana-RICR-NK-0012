import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../../common/entities/user.entity';
import { Course } from '../../common/entities/course.entity';
import { Enrollment } from '../../common/entities/enrollment.entity';
import { CourseProgress } from '../../common/entities/course_progress.entity';
import { Assignment } from '../../common/entities/assignment.entity';
import { AssignmentSubmission } from '../../common/entities/assignment-submission.entity';
import { QuizAttempt } from '../../common/entities/quiz-attempt.entity';
import { StudentActivityLog } from '../../common/entities/student-activity-log.entity';
import { UserSkill } from '../../common/entities/user-skill.entity';
import { Quiz } from '../../common/entities/quiz.entity';
import { JobPost } from '../../common/entities/job-post.entity';
import { Alumni } from '../../common/entities/alumni.entity';
import { TopPerformer } from '../../common/entities/top_performers.entity';
import { ClassSession } from '../../common/entities/class-session.entity';
import { AttendanceRecord } from '../../common/entities/attendance-record.entity';
import { Lesson } from '../../common/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Enrollment,
      CourseProgress,
      Assignment,
      AssignmentSubmission,
      QuizAttempt,
      StudentActivityLog,
      UserSkill,
      Quiz,
      JobPost,
      Alumni,
      TopPerformer,
      ClassSession,
      AttendanceRecord,
      Lesson,
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}