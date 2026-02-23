import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LearningSupportService } from './learning-support.service';
import { LearningSupportController } from './learning-support.controller';

import { Doubt } from '../../common/entities/doubt.entity';
import { DoubtAnswer } from '../../common/entities/doubt-answer.entity';
import { BackupClassRequest } from '../../common/entities/backup-class-request.entity';
import { Course } from '../../common/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doubt,
      DoubtAnswer,
      BackupClassRequest,
      Course,
    ]),
  ],
  controllers: [LearningSupportController],
  providers: [LearningSupportService],
  exports: [LearningSupportService], // optional but useful
})
export class LearningSupportModule {}