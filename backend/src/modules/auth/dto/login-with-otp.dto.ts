import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginWithOtpDto {

  @ApiProperty({
    example: 'student@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6 digit OTP',
  })
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}