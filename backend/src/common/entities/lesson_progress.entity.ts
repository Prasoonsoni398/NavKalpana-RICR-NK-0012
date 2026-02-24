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

  // ✅ Auto Increment ID (MUST be number)
  @PrimaryGeneratedColumn('increment')
  id: number;

  // ✅ Relation with User
  @ManyToOne(() => User, (user) => user.lessonProgress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  student: User;

  // ✅ Relation with Lesson
  @ManyToOne(() => Lesson, (lesson) => lesson.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  // ✅ Completion Status
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  // ✅ Completion Date
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  // ✅ Auto Update Timestamp
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}