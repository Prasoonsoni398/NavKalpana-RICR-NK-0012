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

/* ================================
   ENUM FOR AUTH PROVIDERS
================================ */
export enum AuthProviderType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

@Entity({ name: 'auth_providers' })
@Index(['user', 'provider'], { unique: true })
export class AuthProvider {
  // Primary Key
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Foreign Key to User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Provider Type (ENUM)
  @Column({
    type: 'enum',
    enum: AuthProviderType,
  })
  provider: AuthProviderType;

  // For OAuth providers (GOOGLE, GITHUB)
  @Column({
    name: 'provider_user_id',
    type: 'varchar',
    length: 255,
    nullable: true,   // ✅ FIXED
  })
  providerUserId: string | null;

  // For LOCAL login
  @Column({
    name: 'password_hash',
    type: 'text',
    nullable: true,
  })
  passwordHash: string | null;

  @Column({
    name: 'access_token',
    type: 'text',
    nullable: true,
  })
  accessToken: string | null;

  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: true,
  })
  refreshToken: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;
}