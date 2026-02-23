import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Skill } from './skill.entity';

@Unique(['user', 'skill'])
@Entity({ name: 'user_skills' })
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @CreateDateColumn({ name: 'earned_at' })
  earnedAt: Date;
}