import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  

  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'Profile image URL',
  })
  @IsString()
  @IsOptional()
  profileImage?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
