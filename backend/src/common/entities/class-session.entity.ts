import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity({ name: 'class_sessions' })
export class ClassSession {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Course, (course) => course.classSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'date' })
  sessionDate: Date;

  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}