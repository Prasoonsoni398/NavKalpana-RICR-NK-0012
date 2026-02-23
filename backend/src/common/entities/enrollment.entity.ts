import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { User } from './user.entity';
import { Course } from './course.entity';

@Entity({ name: 'enrollments' })
@Unique(['student', 'course']) // ✅ Prevent duplicate enrollments
export class Enrollment {

  @PrimaryGeneratedColumn('increment')  
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // ✅ ENROLLMENT DATE
  @CreateDateColumn({
    name: 'enrolled_at',
    type: 'timestamp',
  })
  enrolledAt: Date;
}