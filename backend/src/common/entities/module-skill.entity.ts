import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Module } from './module.entity';
import { Skill } from './skill.entity';

@Unique(['module', 'skill'])
@Entity({ name: 'module_skills' })
export class ModuleSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Module, (module) => module.moduleSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @ManyToOne(() => Skill, (skill) => skill.moduleSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}