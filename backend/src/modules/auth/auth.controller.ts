import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { StudentSignupDto } from './dto/student-signup.dto';
import { TeacherSignupDto } from './dto/teacher-signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* =========================================================
     ✅ SIGNUP
  ========================================================= */

  @Post('signup/student')
  @ApiOperation({ summary: 'Student signup & send verification OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  signupStudent(@Body() dto: StudentSignupDto) {
    return this.authService.signupStudent(dto);
  }

  @Post('signup/teacher')
  @ApiOperation({ summary: 'Teacher signup & send verification OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  signupTeacher(@Body() dto: TeacherSignupDto) {
    return this.authService.signupTeacher(dto);
  }

  /* =========================================================
     ✅ VERIFY OTP
  ========================================================= */

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email OTP' })
  @ApiResponse({ status: 200, description: 'Account verified' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  /* =========================================================
     ✅ LOGIN WITH PASSWORD
  ========================================================= */

  @Post('login/student')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiQuery({
    name: 'role',
    example: 'STUDENT',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  loginStudent(
    @Body() dto: LoginDto,
  ) {
    return this.authService.loginWithPassword(dto, "STUDENT");
  }


    @Post('login/teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiQuery({
    name: 'role',
    example: 'TEACHER',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  loginTeacher(
    @Body() dto: LoginDto,
  ) {
    return this.authService.loginWithPassword(dto, "TEACHER");
  }


  /* =========================================================
     ✅ REQUEST LOGIN OTP
  ========================================================= */

  @Post('request-login-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for login' })
  @ApiQuery({
    name: 'role',
    example: 'STUDENT',
    required: true,
  })
  requestLoginOtp(
    @Body() dto: RequestOtpDto,
    @Query('role') role: string,
  ) {
    return this.authService.requestLoginOtp(dto, role);
  }

  /* =========================================================
     ✅ LOGIN WITH OTP
  ========================================================= */

  @Post('login-with-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login using OTP' })
  @ApiQuery({
    name: 'role',
    example: 'STUDENT',
    required: true,
  })
  loginWithOtp(
    @Body() dto: LoginWithOtpDto,
    @Query('role') role: string,
  ) {
    return this.authService.loginWithOtp(dto, role);
  }

  /* =========================================================
     ✅ RESEND VERIFICATION OTP
  ========================================================= */

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification OTP' })
  @ApiQuery({
    name: 'role',
    example: 'STUDENT',
    required: true,
  })
  resendOtp(
    @Body() dto: RequestOtpDto,
    @Query('role') role: string,
  ) {
    return this.authService.resendOtp(dto.email, role);
  }
}