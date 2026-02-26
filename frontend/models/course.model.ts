export interface CreateCourseRequest {
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  thumbnailUrl?: string | null;
  isPublished: boolean;

  // 📅 Attendance
  attendancePercentage: number;
  totalClasses: number;
  presentCount: number;

  // 📚 Lesson Progress
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  isCompleted: boolean;

  createdAt: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  instructorName?: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}