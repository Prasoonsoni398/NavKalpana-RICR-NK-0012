import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartQuizAttemptDto {
  @ApiProperty({
    example: 1,
    description: 'Quiz ID',
  })
  @IsInt()
  quizId: number;

}