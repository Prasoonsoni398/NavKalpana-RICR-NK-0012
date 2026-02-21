import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'submissions' })
export class Submission {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  assignmentId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: 'text', nullable: true })
  textAnswer: string;

  @Column({ nullable: true })
  externalLink: string;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @Column({ default: false })
  isLate: boolean;

  @Column({
    default: 'NOT_SUBMITTED',
  })
  status: string; 
  // NOT_SUBMITTED | SUBMITTED | LATE_SUBMITTED | EVALUATED

  @Column({ nullable: true })
  marks: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;
}