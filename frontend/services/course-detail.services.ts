import { api } from "../lib/api";
import type { CourseDetail } from "@/models/course-detail.model";

class CourseDetailsService {
  private baseUrl = "/course-detail";

  // Get course detail
  async getAll(id: string): Promise<CourseDetail> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Mark lesson as completed
  async markLessonComplete(lessonId: number): Promise<any> {
    const response = await api.post(
      `${this.baseUrl}/lessons/${lessonId}/complete`
    );
    return response.data;
  }
}

export const courseDetailsService = new CourseDetailsService();