import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitAssignmentDto {

  @ApiPropertyOptional({
    description: 'URL of uploaded file',
    example: 'https://example.com/uploads/assignment1.pdf',
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({
    description: 'Text submission content',
    example: 'This is my assignment answer...',
  })
  @IsOptional()
  @IsString()
  textAnswer?: string;   // ✅ fixed name

  @ApiPropertyOptional({
    description: 'External link submission',
    example: 'https://github.com/user/project',
  })
  @IsOptional()
  @IsString()
  externalLink?: string;
}