import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentActivityServiceService } from './student-activity-service.service';
import { CreateStudentActivityServiceDto } from './dto/create-student-activity-service.dto';
import { UpdateStudentActivityServiceDto } from './dto/update-student-activity-service.dto';

@Controller('student-activity-service')
export class StudentActivityServiceController {
  constructor(private readonly studentActivityServiceService: StudentActivityServiceService) {}
}
