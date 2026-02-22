import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';
import { QuestionType } from '../enums/quiz-question.entity';

@Entity({ name: 'quiz_options' })
export class QuizOption {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

    @Column({
  name: 'question_type',
  type: 'enum',
  enum: QuestionType,
})
questionType: QuestionType;
  @ManyToOne(() => QuizQuestion, (q) => q.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @Column({ name: 'option_text', type: 'text' })
  optionText: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect: boolean;
}