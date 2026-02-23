import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity({ name: 'assignments' })
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Lesson, (lesson) => lesson.assignment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' }) // FK lives here
  lesson: Lesson;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'timestamp', nullable: false })
  deadline: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}