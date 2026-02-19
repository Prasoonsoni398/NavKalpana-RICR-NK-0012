import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../common/entities/user.entity';

@Entity({ name: 'otps' })
@Index(['user', 'code', 'type'], { unique: true })
export class Otp {
  @PrimaryGeneratedColumn('increment')
  id: number;

 
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

 
  @Column({ type: 'varchar', length: 10 })
  code: string;

  
  @Column({ type: 'varchar', length: 50 })
  type: string; 
  // Example: EMAIL_VERIFICATION | PASSWORD_RESET

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  
  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
