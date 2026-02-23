import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Company } from './company.entity';

@Entity({ name: 'job_posts' })
export class JobPost {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.jobPosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;
  

  // For PostgreSQL
  @Column({ name: 'required_skills', type: 'jsonb' })
  requiredSkills: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}