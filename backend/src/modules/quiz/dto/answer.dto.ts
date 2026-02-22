import {
  IsUUID,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

export class AnswerDto {
  @IsUUID()
  questionId: string;

  // For MCQ (single/multiple)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  selectedOptionIds?: string[];

  // For TEXT type question
  @IsOptional()
  @IsString()
  textAnswer?: string;
}