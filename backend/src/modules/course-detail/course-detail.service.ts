import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../common/entities/course.entity';
import { Module as CourseModule } from '../../common/entities/module.entity';
import { Lesson } from '../../common/entities/lesson.entity';
import { LessonResource } from '../../common/entities/lesson_resources.entity';
import { LessonProgress } from '../../common/entities/lesson_progress.entity';
import { CourseProgress } from '../../common/entities/course_progress.entity';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class CourseDetailService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(CourseModule)
    private readonly moduleRepo: Repository<CourseModule>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(LessonResource)
    private readonly lessonResourceRepo: Repository<LessonResource>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepo: Repository<LessonProgress>,
    @InjectRepository(CourseProgress)
    private readonly courseProgressRepo: Repository<CourseProgress>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

async getCourseDetail(courseId: number, studentId?: number) {
  const student = await this.userRepo.findOne({
    where: { id: studentId, role: 'STUDENT' },
  });

  if (!student) {
    throw new BadRequestException('Student not found');
  }

  const course = await this.courseRepo.findOne({
    where: { id: courseId },
    relations: [
      'modules',
      'modules.lessons',
      'modules.lessons.resources',
    ],
  });

  if (!course) throw new NotFoundException('Course not found');

  let courseProgressMap: any = {};
  let lessonProgressMap: Record<number, boolean> = {};

  if (studentId) {
    const courseProgress = await this.courseProgressRepo.findOne({
      where: {
        course: { id: courseId },
        student: { id: studentId },
      },
    });

    const lessonProgress = await this.lessonProgressRepo.find({
      where: { student: { id: studentId } },
      relations: ['lesson'], // ✅ FIXED
    });

    courseProgressMap = courseProgress || {};

    lessonProgress.forEach(lp => {
      if (lp.lesson) {
        lessonProgressMap[lp.lesson.id] = lp.completed;
      }
    });
  }

  const modules = course.modules.map(module => {
    const lessons = module.lessons.map(lesson => {
      const completed = lessonProgressMap[lesson.id] || false;

      return {
        id: lesson.id,
        title: lesson.title,
        difficulty: lesson.difficulty,
        completed,
        progress: completed ? 100 : 0, // ✅ ADDED
        resources: lesson.resources.map(r => ({
          id: r.id,
          type: r.resourceType,
          title: r.title,
          url: r.resourceUrl,
          metadata: r.metadataJson,
        })),
      };
    });

    const completedCount = lessons.filter(l => l.completed).length;
    const moduleProgress = lessons.length
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

    return {
      id: module.id,
      title: module.title,
      position: module.position,
      progress: moduleProgress,
      lessons,
    };
  });

  const progress = courseProgressMap?.progressPercentage || 0;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    instructorName: course.instructorName,
    thumbnailUrl: course.thumbnailUrl,
    isPublished: course.isPublished,
    progress,
    modules,
  };
}
async markLessonCompleted(
  lessonId: string,
  studentId: number,
) {
  const lesson = await this.lessonRepo.findOne({
    where: { id: lessonId },
    relations: ['module', 'module.course'],
  });

  if (!lesson) throw new NotFoundException('Lesson not found');

  let lessonProgress = await this.lessonProgressRepo.findOne({
    where: {
      lesson: { id: lessonId },
      student: { id: studentId },
    },
  });

  if (!lessonProgress) {
    lessonProgress = this.lessonProgressRepo.create({
      lesson,
      student: { id: studentId },
      completed: true,
    });
  } else {
    lessonProgress.completed = true;
  }

  await this.lessonProgressRepo.save(lessonProgress);

  const courseId = lesson.module.course.id;

  const totalLessons = await this.lessonRepo.count({
    where: {
      module: { course: { id: courseId } },
    },
  });

  const completedLessons = await this.lessonProgressRepo.count({
    where: {
      student: { id: studentId },
      completed: true,
      lesson: {
        module: { course: { id: courseId } },
      },
    },
  });

  const progressPercentage = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  let courseProgress = await this.courseProgressRepo.findOne({
    where: {
      course: { id: courseId },
      student: { id: studentId },
    },
  });

  if (!courseProgress) {
    courseProgress = this.courseProgressRepo.create({
      course: { id: courseId },
      student: { id: studentId },
      progressPercentage,
    });
  } else {
    courseProgress.progressPercentage = progressPercentage;
  }

  await this.courseProgressRepo.save(courseProgress);

  return {
    message: 'Lesson marked as completed',
    progressPercentage,
  };
}
}