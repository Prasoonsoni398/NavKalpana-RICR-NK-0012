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
  const enrollments = await this.enrollmentRepository.find({
    where: {
      student: { id: userId },
    },
    relations: ['course'],
    order: {
      enrolledAt: 'DESC',
    },
  });

  const attendanceRecords = await this.attendanceRecordRepository.find({
    where: {
      student: { id: userId },
    },
    relations: ['session', 'session.course'],
  });

  const coursesWithAttendance = enrollments.map((enrollment) => {
    const course = enrollment.course;

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

    return {
      ...course,
      attendancePercentage,
      totalClasses,
      presentCount,
    };
  });

  return coursesWithAttendance;
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