import { Module } from '@nestjs/common';
import { LearningSupportService } from './learning-support.service';
import { LearningSupportController } from './learning-support.controller';

@Module({
  controllers: [LearningSupportController],
  providers: [LearningSupportService],
})
export class LearningSupportModule {}
