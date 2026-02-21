import { PartialType } from '@nestjs/swagger';
import { CreateCourseDetailDto } from './create-course-detail.dto';

export class UpdateCourseDetailDto extends PartialType(CreateCourseDetailDto) {}
