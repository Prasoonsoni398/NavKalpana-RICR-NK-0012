import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';

@Entity({ name: 'quiz_options' })
export class QuizOption {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

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