import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../common/entities/course.entity';
import { Module } from '../common/entities/module.entity';
import { Lesson } from '../common/entities/lesson.entity';
import { LessonResource } from '../common/entities/lesson_resources.entity';
import { User } from '../common/entities/user.entity';
import { AuthProvider, AuthProviderType } from '../common/entities/auth_providers.entity';
import { Skill } from '../common/entities/skill.entity';
import { ModuleSkill } from '../common/entities/module-skill.entity';
import { UserSkill } from '../common/entities/user-skill.entity';

import { UserRole } from '../common/enums/user-role.enum';
import { DifficultyLevel } from '../common/enums/difficulty-level.enum';
import { LessonResourceType } from '../common/enums/lesson-resource-type.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const courseRepo = app.get<Repository<Course>>(getRepositoryToken(Course));
  const moduleRepo = app.get<Repository<Module>>(getRepositoryToken(Module));
  const lessonRepo = app.get<Repository<Lesson>>(getRepositoryToken(Lesson));
  const resourceRepo = app.get<Repository<LessonResource>>(getRepositoryToken(LessonResource));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const authProviderRepo = app.get<Repository<AuthProvider>>(getRepositoryToken(AuthProvider));
  const skillRepo = app.get<Repository<Skill>>(getRepositoryToken(Skill));
  const moduleSkillRepo = app.get<Repository<ModuleSkill>>(getRepositoryToken(ModuleSkill));
  const userSkillRepo = app.get<Repository<UserSkill>>(getRepositoryToken(UserSkill));

  console.log('🌱 Starting LMS Seeding...');

  // ===============================
  // 1️⃣ CREATE STUDENT
  // ===============================

  let student = await userRepo.findOne({
    where: { email: 'john@student.com' },
  });

  if (!student) {
    student = await userRepo.save({
      name: 'Ritam',
      email: 'john@student.com',
      role: UserRole.STUDENT,
      isActive: true,
      isVerified: true,
    });

    console.log('👤 Student Created');
  } else {
    console.log('⚠️ Student already exists');
  }

  // ===============================
  // 2️⃣ CREATE LOCAL AUTH PROVIDER
  // ===============================

  const existingAuth = await authProviderRepo.findOne({
    where: {
      user: { id: student.id },
      provider: AuthProviderType.LOCAL,
    },
    relations: ['user'],
  });

  if (!existingAuth) {
    await authProviderRepo.save({
      user: student,
      provider: AuthProviderType.LOCAL,
      passwordHash:
        '$2b$10$ZW1CtFpASe4zWTihCeF2ieF3iSc1LrMkRLRHgN8C98eNU.QFa8lvS',
    });

    console.log('🔐 Auth Provider Created');
  }

  // ===============================
  // 3️⃣ CREATE COURSE
  // ===============================

  const fullStack = await courseRepo.save({
    title: 'Full Stack Development',
    description: 'Complete web development from frontend to backend.',
    instructorName: 'Ritam Sundar Sandhaki',
    isPublished: true,
  });

  // ===============================
  // 4️⃣ CREATE MODULE
  // ===============================

  const fsModule1 = await moduleRepo.save({
    title: 'Frontend Basics',
    position: 1,
    course: fullStack,
  });

  // ===============================
  // 5️⃣ CREATE LESSON
  // ===============================

  const fsLesson1 = await lessonRepo.save({
    title: 'Introduction to React',
    difficulty: DifficultyLevel.BEGINNER,
    position: 1,
    module: fsModule1,
  });

  // ===============================
  // 6️⃣ CREATE LESSON RESOURCES
  // ===============================

  await resourceRepo.save([
    {
      title: 'React Intro Video',
      resourceType: LessonResourceType.VIDEO,
      resourceUrl: 'https://example.com/react-video',
      lesson: fsLesson1,
    },
    {
      title: 'React Notes',
      resourceType: LessonResourceType.NOTES,
      resourceUrl: 'https://example.com/react-notes',
      lesson: fsLesson1,
    },
  ]);

  // ===============================
  // 7️⃣ CREATE SKILLS
  // ===============================

  const skillNames = ['HTML', 'CSS', 'React', 'TypeScript'];
  const skills: Skill[] = [];

  for (const name of skillNames) {
    let skill = await skillRepo.findOne({ where: { name } });

    if (!skill) {
      skill = await skillRepo.save({ name });
      console.log(`🛠 Skill Created: ${name}`);
    }

    skills.push(skill);
  }

  // ===============================
  // 8️⃣ ASSIGN SKILLS TO MODULE
  // ===============================

  for (const skill of skills) {
    const exists = await moduleSkillRepo.findOne({
      where: {
        module: { id: fsModule1.id },
        skill: { id: skill.id },
      },
    });

    if (!exists) {
      await moduleSkillRepo.save({
        module: fsModule1,
        skill,
      });

      console.log(`📚 Skill ${skill.name} added to Module`);
    }
  }

  // ===============================
  // 9️⃣ GIVE SKILLS TO STUDENT (Optional)
  // ===============================

  for (const skill of skills) {
    await userSkillRepo
      .createQueryBuilder()
      .insert()
      .into(UserSkill)
      .values({
        user: { id: student.id },
        skill: { id: skill.id },
      })
      .orIgnore()
      .execute();

    console.log(`🎓 Skill ${skill.name} earned by Student`);
  }

  console.log('✅ LMS Seeding Completed Successfully');
  await app.close();
}

bootstrap();