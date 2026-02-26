import { PartialType } from '@nestjs/swagger';
import { CreateStudentActivityServiceDto } from './create-student-activity-service.dto';

export class UpdateStudentActivityServiceDto extends PartialType(CreateStudentActivityServiceDto) {}
