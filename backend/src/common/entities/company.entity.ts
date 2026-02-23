import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { JobPost } from './job-post.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.company)
  jobPosts: JobPost[];
}