import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
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

import { Quiz } from '../../common/entities/quiz.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create new quiz' })
  @ApiBody({ type: CreateQuizDto })
  @ApiResponse({ status: 201, description: 'Quiz created', type: Quiz })
  async create(@Body() dto: CreateQuizDto) {
    return await this.quizService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of quizzes', type: [Quiz] })
  async findAll() {
    return await this.quizService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Quiz found', type: Quiz })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.quizService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quiz by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Quiz deleted' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.quizService.remove(id);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start quiz attempt' })
  @ApiBody({ type: StartQuizAttemptDto })
  @ApiResponse({ status: 201, description: 'Attempt started' })
  async startAttempt(@Body() dto: StartQuizAttemptDto) {
    return await this.quizService.startAttempt(dto);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit quiz attempt' })
  @ApiBody({ type: SubmitQuizAttemptDto })
  @ApiResponse({
    status: 200,
    description: 'Quiz submitted with score result',
  })
  async submit(@Body() dto: SubmitQuizAttemptDto) {
    return await this.quizService.submitAttempt(dto);
  }
}