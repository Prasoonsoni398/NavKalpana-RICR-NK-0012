import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from './user.entity';
import { StudentActivityType } from '../enums/student-activity-type.enum';
import { ActivityEntityType } from '../enums/activity-entity-type.enum';

@Entity({ name: 'student_activity_logs' })

//  MOST IMPORTANT INDEXES
@Index('IDX_ACTIVITY_STUDENT_DATE', ['student', 'createdAt'])
@Index('IDX_ACTIVITY_STUDENT_TYPE_DATE', ['student', 'activityType', 'createdAt'])
@Index('IDX_ACTIVITY_ENTITY', ['entityType', 'entityId'])

export class StudentActivityLog {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({
    name: 'activity_type',
    type: 'enum',
    enum: StudentActivityType,
  })
  activityType: StudentActivityType;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: ActivityEntityType,
  })
  entityType: ActivityEntityType;

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column({
    name: 'metadata_json',
    type: 'json',
    nullable: true,
  })
  metadataJson: Record<string, any>;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}