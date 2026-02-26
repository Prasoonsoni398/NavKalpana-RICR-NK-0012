import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { BackupStatus } from '../enums/backup-status.enum';

@Entity({ name: 'backup_class_requests' })
export class BackupClassRequest {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'student_id', type: 'int' })
  studentId: number;

  @Column({ name: 'topic', type: 'varchar', length: 255 })
  topic: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: BackupStatus,
    default: BackupStatus.PENDING,
  })
  status: BackupStatus;

  @CreateDateColumn({
    name: 'requested_at',
    type: 'timestamp',
  })
  requestedAt: Date;

  @Column({
    name: 'resolved_at',
    type: 'timestamp',
    nullable: true,
  })
  resolvedAt: Date | null;

  // ─── RELATIONS ──────────────────────────────

  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}