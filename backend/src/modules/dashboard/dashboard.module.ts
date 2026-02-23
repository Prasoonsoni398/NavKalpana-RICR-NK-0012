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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course,Enrollment,CourseProgress,Assignment,AssignmentSubmission,Quiz,QuizAttempt,StudentActivityLog,UserSkill]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}