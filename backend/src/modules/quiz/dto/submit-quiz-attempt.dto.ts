import {
  IsInt,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerDto } from './answer.dto';

export class SubmitQuizAttemptDto {
  @ApiProperty({
    example: 12,
    description: 'Quiz attempt ID',
  })
  @IsInt()
  attemptId: number;

  @ApiProperty({
    type: [AnswerDto],
    description: 'List of answers submitted by student',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}