import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ModuleSkill } from './module-skill.entity';
import { UserSkill } from './user-skill.entity';

@Entity({ name: 'skills' })
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany(() => ModuleSkill, (ms) => ms.skill)
  moduleSkills: ModuleSkill[];

  @OneToMany(() => UserSkill, (us) => us.skill)
  userSkills: UserSkill[];
}