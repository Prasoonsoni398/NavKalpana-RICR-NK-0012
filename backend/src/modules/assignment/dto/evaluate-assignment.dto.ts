import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateAssignmentDto {

  @ApiProperty({
    description: 'Marks given to the student',
    example: 85,
  })
  @IsNumber()
  marks: number;

  @ApiProperty({
    description: 'Feedback for the submission',
    example: 'Good work. Improve formatting next time.',
  })
  @IsString()
  feedback: string;
}