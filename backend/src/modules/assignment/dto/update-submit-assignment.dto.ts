import { IsOptional, IsString } from 'class-validator';

export class SubmitAssignmentDto {

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsString()
  externalLink?: string;
}

