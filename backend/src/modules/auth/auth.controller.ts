import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { StudentSignupDto } from './dto/student-signup.dto';
import { TeacherSignupDto } from './dto/teacher-signup.dto';
// import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //  Student Signup
  @Post('signup/student')
  @ApiOperation({ summary: 'Student signup and send OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent to student email' })
  signupStudent(@Body() dto: StudentSignupDto) {
    return this.authService.signupStudent(dto);
  }

  // Teacher Signup
  @Post('signup/teacher')
  @ApiOperation({ summary: 'Teacher signup and send OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent to teacher email' })
  signupTeacher(@Body() dto: TeacherSignupDto) {
    return this.authService.signupTeacher(dto);
  }

  //  Teacher Login
  // @Post('login/teacher')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Teacher login using email and password' })
  // @ApiResponse({ status: 200, description: 'Login successful' })
  // teacherLogin(@Body() dto: LoginDto) {
  //   return this.authService.loginTeacher(dto);
  // }

  // // 🟢 Admin Login
  // @Post('login/admin')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Admin login using email and password' })
  // @ApiResponse({ status: 200, description: 'Admin login successful' })
  // adminLogin(@Body() dto: LoginDto) {
  //   return this.authService.loginAdmin(dto);
  // }

  // 🟢 Verify OTP
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email OTP for student or teacher' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // 🟢 Resend OTP
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification OTP' })
  resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }
}
