import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ClassSession } from './class-session.entity';
import { User } from './user.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity({ name: 'attendance_records' })
@Unique(['session', 'student'])
export class AttendanceRecord {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ClassSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: ClassSession;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}