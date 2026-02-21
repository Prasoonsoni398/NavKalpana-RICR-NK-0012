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
import { Course } from './course.entity';

@Entity({ name: 'course_progress' })
@Index(['student', 'course'], { unique: true })
export class CourseProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.courseProgress)
  @JoinColumn({ name: 'user_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.progress)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'numeric', default: 0 })
  progressPercentage: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  forcedComplete: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}