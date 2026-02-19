import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;;

 
  @Column({ type: 'varchar', length: 255 })
  name: string;

 
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

 
  @Column({
    type: 'varchar',
    length: 50,
    default: 'STUDENT',
  })
  role: string;

  
  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string | null;

 
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

 
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  // ✅ Updated At
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
