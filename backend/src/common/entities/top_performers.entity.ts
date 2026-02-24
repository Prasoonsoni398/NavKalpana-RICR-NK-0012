import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'top_performers' })
export class TopPerformer {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'int' })
  score: number;

  @CreateDateColumn()
  createdAt: Date;
}