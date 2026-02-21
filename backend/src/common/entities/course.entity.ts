import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Module } from './module.entity';
import { CourseProgress } from './course_progress.entity';

@Entity({ name: 'courses' })
export class Course {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'instructor_name', type: 'varchar', length: 255 })
  instructorName: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  // ─── RELATIONS ──────────────────────────────
  @OneToMany(() => Module, (module) => module.course, {
  })
  modules: Module[];

  @OneToMany(() => CourseProgress, (cp) => cp.course)
  progress: CourseProgress[];
}