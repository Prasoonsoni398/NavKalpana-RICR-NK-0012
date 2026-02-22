import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { StartQuizAttemptDto } from './dto/start-quiz-attempt.dto';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quiz } from '../../common/entities/quiz.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create new quiz' })
  // @ApiBody({ type: CreateQuizDto })
  // @ApiResponse({ status: 201, type: Quiz })
  // create(@Body() dto: CreateQuizDto) {
  //   return this.quizService.create(dto);
  // }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.remove(id);
  }

  @Post('start')
  startAttempt(@Body() dto: StartQuizAttemptDto, @Req() req) {
    const studentId = req.user.id;
    if(!studentId) throw new NotFoundException('Student ID not found in request');
    return this.quizService.startAttempt(dto, studentId);
  }

  @Post('submit')
  submit(@Body() dto: SubmitQuizAttemptDto) {
    return this.quizService.submitAttempt(dto);
  }
}