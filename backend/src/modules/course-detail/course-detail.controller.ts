import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CourseDetailService } from './course-detail.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Course Detail')       // ⭐ Group in Swagger UI
@ApiBearerAuth()                // ⭐ Shows that JWT auth is required
@UseGuards(JwtAuthGuard)
@Controller('course-detail')
export class CourseDetailController {
  constructor(private readonly courseDetailService: CourseDetailService) {}

  /**
   * ⭐ Get full course detail for a student
   * GET /course-detail/:id?studentId=123
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get course detail for a student' })
  @ApiParam({ name: 'id', description: 'Course ID', type: Number })
  // Optional query param (if needed, in this case we use JWT userId)
  @ApiQuery({ name: 'studentId', required: false, type: Number })
  async getCourseDetail(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const studentId = req.user?.id || req.user?.userId;
    return this.courseDetailService.getCourseDetail(id, studentId);
  }

  /**
   * ⭐ Mark a lesson as complete for a student
   * POST /course-detail/lessons/:lessonId/complete
   */
  @Post('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Mark a lesson as complete for a student' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID', type: String })
  async markLessonComplete(
    @Param('lessonId') lessonId: string,
    @Req() req: any,
  ) {
    const studentId = req.user?.id || req.user?.userId;
    return this.courseDetailService.markLessonCompleted(lessonId, studentId);
  }

  /**
 * ⭐ Mark entire course as complete for a student
 * POST /course-detail/:courseId/complete
 */
@Post(':courseId/complete')
@ApiOperation({ summary: 'Mark entire course as complete for a student' })
@ApiParam({ name: 'courseId', description: 'Course ID', type: Number })
async markCourseComplete(
  @Param('courseId') courseId: number,
  @Req() req: any,
) {
  const studentId = req.user?.id || req.user?.userId;

  return this.courseDetailService.markCourseCompleted(
    Number(courseId),
    Number(studentId),
  );
}
}