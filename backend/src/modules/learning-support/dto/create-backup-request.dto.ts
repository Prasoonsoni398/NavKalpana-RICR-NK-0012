import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateBackupRequestDto {

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  topic: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}