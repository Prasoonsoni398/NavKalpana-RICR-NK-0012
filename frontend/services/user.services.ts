import { api } from "../lib/api";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from "@/models/course.model";

class CourseService {
  private baseUrl = "/courses";

  // ✅ CREATE COURSE
  async createCourse(
    data: CreateCourseRequest
  ): Promise<CourseResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  // ✅ GET ALL COURSES
  async getAllCourses(): Promise<CourseResponse[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

   // ✅ GET ALL COURSES
  async getMyCourses(): Promise<CourseResponse[]> {
    const response = await api.get(`${this.baseUrl}/my-courses`);
    return response.data;
  }

  // ✅ GET SINGLE COURSE
  async getCourseById(id: number): Promise<CourseResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ✅ UPDATE COURSE
  async updateCourse(
    id: number,
    data: UpdateCourseRequest
  ): Promise<CourseResponse> {
    const response = await api.patch(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  // ✅ DELETE COURSE
  async deleteCourse(id: number): Promise<{ deleted: boolean }> {
    const response = await api.delete(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }
}

export const courseService = new CourseService();