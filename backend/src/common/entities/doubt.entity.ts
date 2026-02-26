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
import { DoubtAnswer } from './doubt-answer.entity';
import { DoubtStatus } from '../enums/doubt-status.enum';

@Entity({ name: 'doubts' })
export class Doubt {

  @PrimaryGeneratedColumn('increment')
  id: number ;

  @Column({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column({ name: 'topic', type: 'varchar', length: 255 })
  topic: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ name: 'screenshot_url', type: 'text', nullable: true })
  screenshotUrl: string | null;

  @Column({
    type: 'enum',
    enum: DoubtStatus,
    default: DoubtStatus.OPEN,
  })
  status: DoubtStatus;

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

  @ManyToOne(() => Course, (course) => course.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => DoubtAnswer, (answer) => answer.doubt)
  answers: DoubtAnswer[];
}