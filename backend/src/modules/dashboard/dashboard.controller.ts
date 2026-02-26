import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ✅ ADMIN DASHBOARD
  @Get('admin')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data' })
  getAdminDashboard() {
    return this.dashboardService.getAdminStats();
  }

  // ✅ STUDENT DASHBOARD
  @Get('student')
  @ApiOperation({ summary: 'Get logged-in student dashboard data' })
  @ApiResponse({ status: 200, description: 'Student dashboard data' })
  getStudentDashboard(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.dashboardService.getStudentStats(userId);
  }

  // ✅ TEACHER DASHBOARD
  @Get('teacher')
  @ApiOperation({ summary: 'Get logged-in teacher dashboard data' })
  @ApiResponse({ status: 200, description: 'Teacher dashboard data' })
  getTeacherDashboard(@Req() req: any) {
    const userId = req.user?.id || req.user?.userId;
    return this.dashboardService.getTeacherStats(userId);
  }

  // // ✅ ANALYTICS DASHBOARD
  // @Get('analytics')
  // @ApiOperation({ summary: 'Get detailed analytics for logged-in student' })
  // @ApiResponse({ status: 200, description: 'Student analytics data' })
  // async getAnalyticsDashboard(@Req() req: any) {
  //   const userId = req.user?.id || req.user?.userId;
  //   const analytics = await this.dashboardService.getStudentDashboardData(userId);
  //   return {
  //     data: analytics,  
  //   }
  // }
}