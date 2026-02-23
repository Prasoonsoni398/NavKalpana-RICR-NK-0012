import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Assignment } from './assignment.entity';
import { User } from '../../common/entities/user.entity';
import { SubmissionStatus } from '../enums/submission-status.enum';

@Entity({ name: 'assignment_submissions' })
export class AssignmentSubmission {

  @PrimaryGeneratedColumn()
  id: number;

  // ✅ ASSIGNMENT FK
  @Column()
  assignmentId: number;

  @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;

  // ✅ STUDENT FK (KEEP COLUMN)
  @Column()
  studentId: number;

  // ✅ STUDENT RELATION (IMPORTANT)
  @ManyToOne(() => User, (user) => user.submissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: User;

  // ✅ SUBMISSION DATA
  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: 'text', nullable: true })
  textAnswer: string;

  @Column({ nullable: true })
  externalLink: string;

  @CreateDateColumn({ name: 'submission_time' })
  submissionTime: Date;

  @Column({ default: false })
  lateFlag: boolean;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.NOT_SUBMITTED,
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  marks: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}