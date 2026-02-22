import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';

import { Quiz } from '../../common/entities/quiz.entity';
import { QuizQuestion } from '../../common/entities/quiz-question.entity';
import { QuizOption } from '../../common/entities/quiz-option.entity';
import { QuizAttempt } from '../../common/entities/quiz-attempt.entity';
import { User } from 'src/common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      QuizQuestion,
      QuizOption,
      QuizAttempt,
      User
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}