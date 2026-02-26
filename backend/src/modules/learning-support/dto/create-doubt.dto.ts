import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoubtDto {

  @ApiProperty({
    description: 'ID of the course related to the doubt',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({
    description: 'Short topic/title of the doubt',
    example: 'Issue in JWT Authentication',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  topic: string;

  @ApiProperty({
    description: 'Detailed description of the doubt',
    example: 'I am getting 401 Unauthorized error while using JWT token.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Optional file or screenshot URL',
    example: 'https://example.com/screenshot.png',
  })
  @IsOptional()
  @IsString()
  fileUrl?: string; // optional screenshot/file
}