import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBackupRequestDto {

  @ApiProperty({
    description: 'ID of the course for which backup is requested',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({
    description: 'Short title/topic of the backup request',
    example: 'Need recording of Module 3 session',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  topic: string;

  @ApiProperty({
    description: 'Detailed explanation of the backup request',
    example: 'I missed the live session due to internet issues. Please provide backup.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}