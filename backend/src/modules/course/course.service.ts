import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../common/entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Enrollment } from 'src/common/entities/enrollment.entity';
import { User } from 'src/common/entities/user.entity';
import { ClassSession } from 'src/common/entities/class-session.entity';
import { AttendanceRecord } from 'src/common/entities/attendance-record.entity';
import { LessonResource } from 'src/common/entities/lesson_resources.entity';
import { LessonProgress } from 'src/common/entities/lesson_progress.entity';
import { Lesson } from 'src/common/entities/lesson.entity';

@Injectable()
export class CourseService {
  constructor(
      @InjectRepository(Course)
      private readonly courseRepository: Repository<Course>,
      @InjectRepository(Enrollment)
      private readonly enrollmentRepository: Repository<Enrollment>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(ClassSession)
      private readonly classSessionRepository: Repository<ClassSession>,
      @InjectRepository(AttendanceRecord)
      private readonly attendanceRecordRepository: Repository<AttendanceRecord>,
      @InjectRepository(LessonResource)
      private readonly lessonResourceRepository: Repository<LessonResource>,
      @InjectRepository(LessonProgress)
      private readonly lessonProgressRepository: Repository<LessonProgress>,
      @InjectRepository(Lesson)
      private readonly lessonRepository: Repository<Lesson>,
  ) {}

  // Create Course
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  //Get All Courses
  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }


  async findMyAllCourse(userId: number): Promise<any[]> {
  // 1️⃣ Get enrollments with full course structure
  const enrollments = await this.enrollmentRepository.find({
    where: {
      student: { id: userId },
    },
    relations: [
      'course',
      'course.modules',
      'course.modules.lessons',
    ],
    order: {
      enrolledAt: 'DESC',
    },
  });

  // 2️⃣ Get attendance
  const attendanceRecords = await this.attendanceRecordRepository.find({
    where: {
      student: { id: userId },
    },
    relations: ['session', 'session.course'],
  });

  // 3️⃣ Get all completed lesson progress for this student
  const lessonProgress = await this.lessonProgressRepository.find({
    where: {
      student: { id: userId },
      completed: true,
    },
    relations: ['lesson'],
  });

  const progressMap = new Map(
    lessonProgress.map((lp) => [lp.lesson.id, true]),
  );

  // 4️⃣ Build response
  const coursesWithFullData = enrollments.map((enrollment) => {
    const course = enrollment.course;

    // 🔹 Attendance calculation
    const attendanceForCourse = attendanceRecords.filter(
      (record) => record.session.course.id === course.id,
    );

    const totalClasses = attendanceForCourse.length;

    const presentCount = attendanceForCourse.filter(
      (record) => record.status === 'PRESENT',
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? Math.round((presentCount / totalClasses) * 100)
        : 0;

    // 🔹 Progress calculation
    let totalLessons = 0;
    let completedLessons = 0;

    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        totalLessons++;

        if (progressMap.has(lesson.id)) {
          completedLessons++;
        }
      });
    });

    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      id: course.id,
      title: course.title,
      description: course.description,

      // 🎯 Attendance
      attendancePercentage,
      totalClasses,
      presentCount,

      // 🎯 Progress
      totalLessons,
      completedLessons,
      completionPercentage,
      isCompleted: completionPercentage === 100,
    };
  });

  return coursesWithFullData;
}


// 🎯 Get Course Full Progress Tree
async getCourseProgressTree(courseId: number, studentId: number) {
  // 1️⃣ Get full course with modules & lessons
  const course = await this.courseRepository.findOne({
    where: { id: courseId },
    relations: [
      'modules',
      'modules.lessons',
    ],
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  // 2️⃣ Get all lesson progress for that student in this course
  const lessonProgress = await this.lessonProgressRepository.find({
    where: {
      student: { id: studentId },
    },
    relations: ['lesson'],
  });

  // Convert to Map for fast lookup
  const progressMap = new Map(
    lessonProgress.map((lp) => [lp.lesson.id, lp]),
  );

  let totalLessonsInCourse = 0;
  let totalCompletedInCourse = 0;

  // 3️⃣ Build Tree
  const modules = course.modules.map((module) => {
    let moduleTotalLessons = module.lessons.length;
    let moduleCompletedLessons = 0;

    const lessons = module.lessons.map((lesson) => {
      totalLessonsInCourse++;

      const progress = progressMap.get(lesson.id);
      const isCompleted = progress?.completed ?? false;

      if (isCompleted) {
        moduleCompletedLessons++;
        totalCompletedInCourse++;
      }

      return {
        id: lesson.id,
        title: lesson.title,
        completed: isCompleted,
        completedAt: progress?.completedAt ?? null,
      };
    });

    const modulePercentage =
      moduleTotalLessons > 0
        ? Math.round((moduleCompletedLessons / moduleTotalLessons) * 100)
        : 0;

    return {
      id: module.id,
      title: module.title,
      totalLessons: moduleTotalLessons,
      completedLessons: moduleCompletedLessons,
      completionPercentage: modulePercentage,
      lessons,
    };
  });

  // 4️⃣ Course Completion %
  const coursePercentage =
    totalLessonsInCourse > 0
      ? Math.round((totalCompletedInCourse / totalLessonsInCourse) * 100)
      : 0;

  return {
    courseId: course.id,
    courseTitle: course.title,
    totalLessons: totalLessonsInCourse,
    completedLessons: totalCompletedInCourse,
    completionPercentage: coursePercentage,
    modules,
  };
}

// 🎯 Get Overall Course Progress (Simple Summary)
async getOverallCourseProgress(courseId: number, studentId: number) {
  // 1️⃣ Get all lessons in this course
  const course = await this.courseRepository.findOne({
    where: { id: courseId },
    relations: ['modules', 'modules.lessons'],
  });

  if (!course) {
    throw new NotFoundException('Course not found');
  }

  // 2️⃣ Get student progress only for this course
  const lessonProgress = await this.lessonProgressRepository
    .createQueryBuilder('lp')
    .leftJoin('lp.lesson', 'lesson')
    .leftJoin('lesson.module', 'module')
    .where('lp.studentId = :studentId', { studentId })
    .andWhere('module.courseId = :courseId', { courseId })
    .andWhere('lp.completed = true')
    .getMany();

  let totalLessons = 0;

  course.modules.forEach((module) => {
    totalLessons += module.lessons.length;
  });

  const completedLessons = lessonProgress.length;

  const completionPercentage =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  return {
    courseId: course.id,
    courseTitle: course.title,
    totalLessons,
    completedLessons,
    completionPercentage,
    isCompleted: completionPercentage === 100,
  };
}
  // Get Course By ID
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  // ✅ Update Course
  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  // ✅ Soft Delete Course (Optional)
  async remove(id: number): Promise<{ deleted: boolean }> {
    const course = await this.findOne(id);

    await this.courseRepository.remove(course);

    return { deleted: true };
  }
}