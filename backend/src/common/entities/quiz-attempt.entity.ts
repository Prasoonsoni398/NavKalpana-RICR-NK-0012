import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from './user.entity';

@Entity({ name: 'quiz_attempts' })
@Index(['quizId'])
@Index(['studentId'])
export class QuizAttempt {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Quiz FK
  @Column({ name: 'quiz_id', type: 'int' })
  quizId: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  // Student FK
  @Column({ name: 'student_id', type: 'int' })
  studentId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt: Date | null;

  @Column({ name: 'score_percentage', type: 'float', nullable: true })
  scorePercentage: number | null;

  @Column({ name: 'correct_count', type: 'int', nullable: true })
  correctCount: number | null;

  @Column({ name: 'incorrect_count', type: 'int', nullable: true })
  incorrectCount: number | null;
}