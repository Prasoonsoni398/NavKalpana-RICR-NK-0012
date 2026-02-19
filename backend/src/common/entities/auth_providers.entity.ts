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

@Entity({ name: 'auth_providers' })
@Index(['user', 'provider'], { unique: true })
export class AuthProvider {
  //Incremental Primary Key
  @PrimaryGeneratedColumn('increment')
  id: number;

  //Foreign Key to User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @Column({ name: 'provider_user_id', type: 'varchar', length: 255 })
  providerUserId: string;

  @Column({ name: 'password_hash', type: 'text', nullable: true })
  passwordHash: string | null;

  @Column({ name: 'access_token', type: 'text', nullable: true })
  accessToken: string | null;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}
