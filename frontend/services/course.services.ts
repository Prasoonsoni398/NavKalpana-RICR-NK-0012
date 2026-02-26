import { api } from "../lib/api";
import type {
  CreateCourseRequest,
CourseResponse,
} from "@/models/course.model";

class CourseService {
  private baseUrl = "/courses";

  // =============================
  // Get All Courses (Student)
  // =============================
  async getAll(): Promise<CourseResponse[]> {
    const response = await api.get(`${this.baseUrl}`);
    return response.data;
  }

  // =============================
  // Get My Enrolled Courses
  // =============================
  async getMyCourses(): Promise<CourseResponse[]> {
    const response = await api.get(`${this.baseUrl}/my-courses`);
    return response.data;
  }

  // =============================
  // Get Course By ID
  // =============================
  async getById(id: string): Promise<CourseResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // =============================
  // Create Course (Admin/Instructor)
  // =============================
  async create(data: CreateCourseRequest): Promise<CourseResponse> {
    const response = await api.post(`${this.baseUrl}`, data);
    return response.data;
  }

  // =============================
  // Update Course
  // =============================
  async update(
    id: number,
    data: Partial<CreateCourseRequest>
  ): Promise<CourseResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // =============================
  // Delete Course
  // =============================
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export const courseService = new CourseService();