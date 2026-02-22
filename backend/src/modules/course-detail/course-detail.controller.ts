import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseDetailService } from './course-detail.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('course-detail')
export class CourseDetailController {
  constructor(private readonly courseDetailService: CourseDetailService) {}

  /**
   * GET /course-detail/:id?studentId=123
   */
  @Get(':id')
  async getCourseDetail(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const studentId = req.user?.id || req.user?.userId;
    return this.courseDetailService.getCourseDetail(
      id,
      studentId
    );
  }

  /**
   * POST /course-detail/lessons/:lessonId/complete
   * Body: { studentId: number }
   */
  @Post('lessons/:lessonId/complete')
  async markLessonComplete(
    @Param('lessonId') lessonId: string, 
     @Req() req: any,
  ) {
    const studentId = req.user?.id || req.user?.userId;
    return this.courseDetailService.markLessonCompleted(
      lessonId,
      studentId,
    );
  }
}