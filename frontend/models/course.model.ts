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
  attendancePercentage: number;
  totalClasses: number;
  presentCount: number;
  createdAt: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  instructorName?: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}