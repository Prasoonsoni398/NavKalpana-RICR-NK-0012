import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {

  @ApiProperty({
    example: 'student@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password@123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}