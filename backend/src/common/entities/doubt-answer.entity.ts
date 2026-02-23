import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Doubt } from './doubt.entity';

@Entity({ name: 'doubt_answers' })
export class DoubtAnswer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'answered_by', type: 'uuid' })
  answeredBy: string;

  @Column({ type: 'text' })
  answer: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  // ─── RELATIONS ──────────────────────────────

  @ManyToOne(() => Doubt, (doubt) => doubt.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doubt_id' })
  doubt: Doubt;
}