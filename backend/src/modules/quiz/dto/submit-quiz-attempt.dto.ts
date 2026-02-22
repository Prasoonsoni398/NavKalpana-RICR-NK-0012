import {
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerDto } from './answer.dto';

export class SubmitQuizAttemptDto {
  @IsUUID()
  attemptId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}