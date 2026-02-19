import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { UserRole } from '../../../common/entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.STUDENT;

  @IsString()
  @IsOptional()
  profile_image?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
