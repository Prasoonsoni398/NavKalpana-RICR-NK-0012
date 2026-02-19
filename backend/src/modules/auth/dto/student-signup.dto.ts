import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentSignupDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the student',
  })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'john@student.com',
    description: 'Student email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password must be at least 6 characters and contain at least one letter and one number',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
