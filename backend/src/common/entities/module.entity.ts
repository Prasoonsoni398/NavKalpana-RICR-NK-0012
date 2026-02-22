import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'modules' })
export class Module {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ManyToOne(() => Course, (course) => course.modules)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int' })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];
}