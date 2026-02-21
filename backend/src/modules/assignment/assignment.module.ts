import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from '../../common/entities/assignment.entity';
import { Submission } from '../../common/entities/submission.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, Submission]), // VERY IMPORTANT
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService], // MUST BE HERE
  exports: [AssignmentService], // optional but good practice
})
export class AssignmentModule {}