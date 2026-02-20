import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {

  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address of the user',
  })
  @IsEmail()
  email: string;
}