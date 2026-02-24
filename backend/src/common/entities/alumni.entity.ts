import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'alumni' })
export class Alumni {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  position: string;

  @Column({ type: 'varchar', length: 150 })
  company: string;

  @Column({ type: 'varchar', length: 20 })
  batch: string;
}