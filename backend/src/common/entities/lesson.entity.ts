import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Module } from './module.entity';
import { LessonResource } from './lesson_resources.entity';
import { LessonProgress } from './lesson_progress.entity';
import { Assignment } from './assignment.entity';
import { DifficultyLevel } from '../enums/difficulty-level.enum';
import { Quiz } from './quiz.entity';

@Entity({ name: 'lessons' })
export class Lesson {
 @PrimaryGeneratedColumn('increment')
id: number;   // ✅ change from string to number

  @ManyToOne(() => Module, (module) => module.lessons)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.BEGINNER,
  })
  difficulty: DifficultyLevel;

  @Column({ type: 'int' })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => LessonResource, (res) => res.lesson)
  resources: LessonResource[];

  @OneToMany(() => LessonProgress, (lp) => lp.lesson)
  progress: LessonProgress[];

  // ✅ Assignment Relation
  @OneToOne(() => Assignment, (assignment) => assignment.lesson)
  assignment: Assignment;
  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];
}