import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../common/entities/course.entity';
import { Module as CourseModule } from '../../common/entities/module.entity';
import { Lesson } from '../../common/entities/lesson.entity';
import { LessonResource } from '../../common/entities/lesson_resources.entity';
import { LessonProgress } from '../../common/entities/lesson_progress.entity';
import { CourseProgress } from '../../common/entities/course_progress.entity';

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
  ) {}

  /**
   * GET Course Detail with modules, lessons, resources, and progress
   * @param courseId 
   * @param studentId optional: for progress calculation
   */
  async getCourseDetail(courseId: number, studentId?: number) {
    // Fetch course with modules and lessons
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['modules', 'modules.lessons', 'modules.lessons.resources'],
    });

    if (!course) throw new NotFoundException('Course not found');

    // Optional: fetch student progress
    let courseProgressMap = {};
    let lessonProgressMap = {};

    if (studentId) {
      const courseProgress = await this.courseProgressRepo.findOne({
        where: { course: { id: courseId }, student: { id: studentId } },
      });
      const lessonProgress = await this.lessonProgressRepo.find({
        where: { student: { id: studentId } },
      });

      courseProgressMap = courseProgress || {};
      lessonProgress.forEach(lp => {
        lessonProgressMap[lp.lesson.id] = lp.completed;
      });
    }

    // Prepare response
    const modules = course.modules.map(module => {
      const lessons = module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        difficulty: lesson.difficulty,
        completed: lessonProgressMap[lesson.id] || false,
        resources: lesson.resources.map(r => ({
          id: r.id,
          type: r.resourceType,
          title: r.title,
          url: r.resourceUrl,
          metadata: r.metadataJson,
        })),
      }));

      // Module progress = completed lessons / total lessons
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

    // Course progress (cached if available)
    const progress = courseProgressMap['progressPercentage'] || 0;

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
}