import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentController {

  constructor(private readonly service: AssignmentService) {}

  @Post()
  create(@Body() dto) {
    return this.service.create(dto);
  }

  @Post(':id/submit/:userId')
  submit(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto,
  ) {
    return this.service.submit(id, userId, dto);
  }

  @Post('evaluate/:submissionId')
  evaluate(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() dto,
  ) {
    return this.service.evaluate(submissionId, dto);
  }
}