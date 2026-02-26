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

import { Enrollment } from '../common/entities/enrollment.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { DifficultyLevel } from '../common/enums/difficulty-level.enum';
import { LessonResourceType } from '../common/enums/lesson-resource-type.enum';
import { Assignment } from '../common/entities/assignment.entity';
import { AssignmentSubmission } from '../common/entities/assignment-submission.entity';
import { SubmissionStatus } from '../common/enums/submission-status.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const courseRepo = app.get<Repository<Course>>(getRepositoryToken(Course));
  const moduleRepo = app.get<Repository<Module>>(getRepositoryToken(Module));
  const lessonRepo = app.get<Repository<Lesson>>(getRepositoryToken(Lesson));
  const resourceRepo = app.get<Repository<LessonResource>>(getRepositoryToken(LessonResource));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const authProviderRepo = app.get<Repository<AuthProvider>>(getRepositoryToken(AuthProvider));
  const enrollmentRepo = app.get<Repository<Enrollment>>(getRepositoryToken(Enrollment));
  const assignmentRepo = app.get<Repository<Assignment>>(getRepositoryToken(Assignment));
const submissionRepo = app.get<Repository<AssignmentSubmission>>(getRepositoryToken(AssignmentSubmission));


  
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
        '$2b$10$icYcWB9sfBeCi6XFC/Mlt.rxPbPHJpwkE60BYcUKoZXkRSrOE7uzS',
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
    thumbnailUrl: 'https://d2ms8rpfqc4h24.cloudfront.net/Guide_to_Full_Stack_Development_000eb0b2d0.jpg',
  });

  const backend = await courseRepo.save({
    title: 'Backend Development',
    description: 'Complete backend development with Node.js and Express.',
    instructorName: 'Ritam Sundar Sandhaki',
    isPublished: true,
    thumbnailUrl: 'https://d2ms8rpfqc4h24.cloudfront.net/Guide_to_Full_Stack_Development_000eb0b2d0.jpg',
  });

  // ===============================
  // 4️⃣ CREATE MODULE
  // ===============================

  const fsModule1 = await moduleRepo.save({
    title: 'Frontend Basics',
    position: 1,
    course: fullStack,
  });

  const fsModule2 = await moduleRepo.save({
    title: 'Frontend Advanced',
    position: 2,
    course: fullStack,
  });

  const backendModule1 = await moduleRepo.save({
    title: 'Backend Basics',
    position: 1,
    course: backend,
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
// ===============================
// 8️⃣ ENROLL STUDENT IN COURSE
// ===============================

const existingEnrollment = await enrollmentRepo.findOne({
  where: {
    student: { id: student.id },
    course: { id: fullStack.id },
  },
  relations: ['student', 'course'],
});

if (!existingEnrollment) {
  await enrollmentRepo.save({
    student: student,
    course: fullStack,
  });

  console.log('📚 Student Enrolled in Course');
} else {
  console.log('⚠️ Student already enrolled');
}

// Check if assignment exists for the lesson
let reactAssignment = await assignmentRepo.findOne({
  where: { lesson: { id: fsLesson1.id } },
  relations: ['lesson'],
});

if (!reactAssignment) {
  reactAssignment = await assignmentRepo.save({
    lesson: fsLesson1,
    title: 'React Basics Assignment',
    description: 'Complete exercises on React components and state management.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log('📝 Assignment Created for Lesson: React Intro');
} else {
  console.log('⚠️ Assignment already exists for this lesson');
}
  

  console.log('✅ LMS Seeding Completed Successfully');
  await app.close();
}

bootstrap();