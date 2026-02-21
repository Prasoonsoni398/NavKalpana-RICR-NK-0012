import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Otp } from './otps.entity';
import { CourseProgress } from './course_progress.entity';
import { LessonProgress } from './lesson_progress.entity';

@Entity({ name: 'users' })
@Index(['email', 'role'], { unique: true })

export class User {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'STUDENT',
  })
  role: string;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  
  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  // ─── RELATIONS ──────────────────────────────
  courseProgress: CourseProgress[]
  lessonProgress: LessonProgress[]
  otps: Otp[]

}