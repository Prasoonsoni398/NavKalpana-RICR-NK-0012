import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CourseDetailService } from './course-detail.service';

@Controller('course-detail')
export class CourseDetailController {
  constructor(private readonly courseDetailService: CourseDetailService) {}

  /**
   * GET /course-detail/:id?studentId=123
   * Returns full course detail with modules, lessons, resources, and progress
   */
  @Get(':id')
  async getCourseDetail(
    @Param('id', ParseIntPipe) id: number,
    @Query('studentId') studentId?: string,
  ) {
    return this.courseDetailService.getCourseDetail(
      id,
      studentId ? parseInt(studentId, 10) : undefined,
    );
  }
}