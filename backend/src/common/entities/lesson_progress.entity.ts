import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'lesson_progress' })
@Index(['student', 'lesson'], { unique: true })
export class LessonProgress {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ManyToOne(() => User, (user) => user.lessonProgress)
  @JoinColumn({ name: 'user_id' })
  student: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}