import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from '../common/entities/course.entity';
import { Module } from '../common/entities/module.entity';
import { Lesson } from '../common/entities/lesson.entity';
import { LessonResource } from '../common/entities/lesson_resources.entity';

import { DifficultyLevel } from '../common/enums/difficulty-level.enum';
import { LessonResourceType } from '../common/enums/lesson-resource-type.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const courseRepo = app.get<Repository<Course>>(getRepositoryToken(Course));
  const moduleRepo = app.get<Repository<Module>>(getRepositoryToken(Module));
  const lessonRepo = app.get<Repository<Lesson>>(getRepositoryToken(Lesson));
  const resourceRepo = app.get<Repository<LessonResource>>(getRepositoryToken(LessonResource));

  console.log('🌱 Starting LMS Seeding...');

  // -------------------------------
  // COURSE 1: Full Stack Development
  // -------------------------------
  const fullStack = await courseRepo.save({
    title: 'Full Stack Development',
    description: 'Complete web development from frontend to backend.',
    instructorName: 'Ritam Sundar Sandhaki',
    isPublished: true,
  });

  const fsModule1 = await moduleRepo.save({
    title: 'Frontend Basics',
    position: 1,
    course: fullStack,
  });

  const fsLesson1 = await lessonRepo.save({
    title: 'Introduction to React',
    difficulty: DifficultyLevel.BEGINNER,
    position: 1,
    module: fsModule1,
  });

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

  // -------------------------------
  // COURSE 2: Data Science
  // -------------------------------
  const dataScience = await courseRepo.save({
    title: 'Data Science',
    description: 'Learn Python, ML, and AI fundamentals.',
    instructorName: 'Ritam Sundar Sandhaki',
    isPublished: true,
  });

  const dsModule1 = await moduleRepo.save({
    title: 'Python for Data Science',
    position: 1,
    course: dataScience,
  });

  const dsLesson1 = await lessonRepo.save({
    title: 'NumPy & Pandas',
    difficulty: DifficultyLevel.INTERMEDIATE,
    position: 1,
    module: dsModule1,
  });

  await resourceRepo.save({
    title: 'Pandas Tutorial',
    resourceType: LessonResourceType.VIDEO,
    resourceUrl: 'https://example.com/pandas',
    lesson: dsLesson1,
  });

  // -------------------------------
  // COURSE 3: DevOps
  // -------------------------------
  const devOps = await courseRepo.save({
    title: 'DevOps',
    description: 'CI/CD, Docker, Kubernetes & Cloud.',
    instructorName: 'Ritam Sundar Sandhaki',
    isPublished: true,
  });

  const devModule1 = await moduleRepo.save({
    title: 'Docker Fundamentals',
    position: 1,
    course: devOps,
  });

  const devLesson1 = await lessonRepo.save({
    title: 'Docker Basics',
    difficulty: DifficultyLevel.BEGINNER,
    position: 1,
    module: devModule1,
  });

  await resourceRepo.save({
    title: 'Docker Hands-on Lab',
    resourceType: LessonResourceType.CODELAB,
    resourceUrl: 'https://example.com/docker-lab',
    lesson: devLesson1,
  });

  console.log('✅ LMS Seeding Completed Successfully');
  await app.close();
}

bootstrap();