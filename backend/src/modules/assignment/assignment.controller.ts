import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
// import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/update-submit-assignment.dto';
import { EvaluateAssignmentDto } from './dto/evaluate-assignment.dto';
import { Assignment } from '../../common/entities/assignment.entity';
import { Submission } from '../../common/entities/submission.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // ✅ CREATE ASSIGNMENT
  @Post()
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiBody({ type: CreateAssignmentDto })
  @ApiResponse({ status: 201, type: Assignment })
  async create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  // ✅ GET ALL ASSIGNMENTS
  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, type: [Assignment] })
  async findAll() {
    return this.assignmentService.findAll();
  }

  // ✅ GET ONE ASSIGNMENT
  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Assignment })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.findOne(id);
  }

  // ✅ UPDATE ASSIGNMENT
  // @Patch(':id')
  // @ApiOperation({ summary: 'Update assignment by ID' })
  // @ApiParam({ name: 'id', type: Number })
  // @ApiBody({ type: UpdateAssignmentDto })
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateAssignmentDto,
  // ) {
  //   return this.assignmentService.update(id, dto);
  // }

  // ✅ DELETE ASSIGNMENT
  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment by ID' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.remove(id);
  }

  // ✅ SUBMIT ASSIGNMENT
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit assignment (logged-in user)' })
  @ApiBody({ type: SubmitAssignmentDto })
  @ApiResponse({ status: 201, type: Submission })
  async submit(
    @Param('id', ParseIntPipe) assignmentId: number,
    @Req() req: any,
    @Body() dto: SubmitAssignmentDto,
  ) {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.assignmentService.submit(assignmentId, userId, dto);
  }

  // ✅ EVALUATE SUBMISSION
  @Patch('evaluate/:submissionId')
  @ApiOperation({ summary: 'Evaluate submission (Instructor only)' })
  @ApiParam({ name: 'submissionId', type: Number })
  @ApiBody({ type: EvaluateAssignmentDto })
  async evaluate(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() dto: EvaluateAssignmentDto,
  ) {
    return this.assignmentService.evaluate(submissionId, dto);
  }
}