import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherSignupDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Full name of the teacher' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'jane@teacher.com', description: 'Valid email address' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Teacher123',
    description: 'Password must have at least one letter and one number',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
