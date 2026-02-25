import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { User } from '../../common/entities/user.entity';
import { Course } from '../../common/entities/course.entity';
import { Enrollment } from '../../common/entities/enrollment.entity';
import { CourseProgress } from 'src/common/entities/course_progress.entity';
import { Assignment } from '../../common/entities/assignment.entity';
import { AssignmentSubmission } from 'src/common/entities/assignment-submission.entity';
import { Quiz } from 'src/common/entities/quiz.entity';
import { QuizAttempt } from 'src/common/entities/quiz-attempt.entity';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';
import { UserSkill } from '../../common/entities/user-skill.entity';
import { JobPost } from 'src/common/entities/job-post.entity';
import { Alumni } from 'src/common/entities/alumni.entity';
import { TopPerformer } from 'src/common/entities/top_performers.entity';
import { ClassSession } from 'src/common/entities/class-session.entity';
import { AttendanceRecord } from 'src/common/entities/attendance-record.entity';
import { AttendanceStatus } from 'src/common/enums/attendance-status.enum';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course,Enrollment,CourseProgress,Assignment,AssignmentSubmission,Quiz,QuizAttempt,StudentActivityLog,UserSkill,JobPost,Alumni,TopPerformer,ClassSession,AttendanceRecord]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}