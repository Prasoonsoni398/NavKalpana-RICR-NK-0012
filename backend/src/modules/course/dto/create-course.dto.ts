import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {

  @ApiProperty({
    example: 'Full Stack MERN Development',
    description: 'Title of the course',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Complete MERN stack course from beginner to advanced',
    description: 'Detailed course description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the instructor',
  })
  @IsString()
  @IsNotEmpty()
  instructorName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/course-thumbnail.jpg',
    description: 'Thumbnail image URL of the course',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates whether the course is published',
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}