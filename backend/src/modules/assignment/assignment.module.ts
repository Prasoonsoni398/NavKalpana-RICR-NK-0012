import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from '../../common/entities/assignment.entity';
import { AssignmentSubmission } from 'src/common/entities/assignment-submission.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, AssignmentSubmission, User]), // VERY IMPORTANT
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService], // MUST BE HERE
  exports: [AssignmentService], // optional but good practice
})
export class AssignmentModule {}