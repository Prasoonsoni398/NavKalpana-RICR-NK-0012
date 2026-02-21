import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { LessonResourceType } from '../enums/lesson-resource-type.enum';

@Entity({ name: 'lesson_resources' })
export class LessonResource {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.resources)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({
    type: 'enum',
    enum: LessonResourceType,
  })
  resourceType: LessonResourceType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  resourceUrl: string;

  @Column({ type: 'json', nullable: true })
  metadataJson: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}