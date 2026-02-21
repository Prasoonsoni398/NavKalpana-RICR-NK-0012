import { IsNumber, IsString } from 'class-validator';

export class EvaluateAssignmentDto {

  @IsNumber()
  marks: number;

  @IsString()
  feedback: string;
}