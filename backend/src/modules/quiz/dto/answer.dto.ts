import {
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({
    example: 5,
    description: 'Question ID',
  })
  @IsInt()
  questionId: number;

  // For SINGLE / MULTIPLE questions
  @ApiProperty({
    example: [21],
    description: 'Selected option IDs',
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  selectedOptionIds?: number[];
}