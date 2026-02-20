import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../common/entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // ✅ Create Course
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  // ✅ Get All Courses
  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  // ✅ Get Course By ID
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