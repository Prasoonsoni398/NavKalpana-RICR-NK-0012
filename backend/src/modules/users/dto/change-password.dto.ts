import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'NewStrongPassword@123' })
  @IsString()
  @MinLength(8)
  oldPassword: string;
  @ApiProperty({ example: 'NewStrongPassword@123' })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ example: 'NewStrongPassword@123' })
  @IsString()
  confirmPassword: string;
}