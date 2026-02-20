import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Registered email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: UserRole.STUDENT,
    description: 'Role of the user',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}