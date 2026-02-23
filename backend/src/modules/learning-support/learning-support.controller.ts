import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LearningSupportService } from './learning-support.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { CreateBackupRequestDto } from './dto/create-backup-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Learning Support')
@ApiBearerAuth() // 🔥 tells Swagger this uses JWT
@UseGuards(JwtAuthGuard)
@Controller('learning-support')
export class LearningSupportController {
  constructor(
    private readonly learningSupportService: LearningSupportService,
  ) {}

  // ================================
  // 1️⃣ Submit Doubt
  // ================================
  @Post('doubt')
  @ApiOperation({ summary: 'Submit a doubt' })
  @ApiResponse({ status: 201, description: 'Doubt submitted successfully' })
  submitDoubt(
    @Body() createDoubtDto: CreateDoubtDto,
    @Req() req,
  ) {
    const studentId = req.user.id;
    return this.learningSupportService.submitDoubt(
      studentId,
      createDoubtDto,
    );
  }

  // ================================
  // 2️⃣ Request Backup Class
  // ================================
  @Post('backup-request')
  @ApiOperation({ summary: 'Request a backup class' })
  @ApiResponse({ status: 201, description: 'Backup request submitted successfully' })
  requestBackupClass(
    @Body() createBackupDto: CreateBackupRequestDto,
    @Req() req,
  ) {
    const studentId = req.user.id;
    return this.learningSupportService.requestBackupClass(
      studentId,
      createBackupDto,
    );
  }

  // ================================
  // 3️⃣ Get Student Doubts
  // ================================
  @Get('my-doubts')
  @ApiOperation({ summary: 'Get all doubts of logged-in student' })
  @ApiResponse({ status: 200, description: 'List of student doubts' })
  getMyDoubts(@Req() req) {
    const studentId = req.user.id;
    return this.learningSupportService.getStudentDoubts(studentId);
  }

  // ================================
  // 4️⃣ Get Student Backup Requests
  // ================================
  @Get('my-backup-requests')
  @ApiOperation({ summary: 'Get all backup requests of logged-in student' })
  @ApiResponse({ status: 200, description: 'List of backup requests' })
  getMyBackupRequests(@Req() req) {
    const studentId = req.user.id;
    return this.learningSupportService.getStudentBackupRequests(
      studentId,
    );
  }
}