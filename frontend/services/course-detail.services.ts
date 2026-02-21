import { api } from "../lib/api";
import type {CourseDetail } from "@/models/course-detail.model";

class CourseDetailsService {
  private baseUrl = "/course-detail";

  // Get all courses detail
  async getAll(id:string): Promise<CourseDetail[]> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const courseDetailsService = new CourseDetailsService();