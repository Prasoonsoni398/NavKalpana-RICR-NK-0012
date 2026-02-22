import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { QuizOption } from './quiz-option.entity';
import { QuestionType } from '../enums/question_type_enum';

@Entity({ name: 'quiz_questions' })
@Index(['quizId'])
export class QuizQuestion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Foreign Key → quizzes.id
  @Column({ name: 'quiz_id', type: 'int' })
  quizId: number;

  // Relation with Quiz
  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  // Question text
  @Column({ type: 'text' })
  question: string;

  // Question type
  @Column({
    name: 'question_type',
    type: 'enum',
    enum: QuestionType,
  })
  questionType: QuestionType;

  // Optional explanation
  @Column({ type: 'text', nullable: true })
  explanation: string | null;

  // Options
  @OneToMany(() => QuizOption, (option) => option.question)
  options: QuizOption[];
}