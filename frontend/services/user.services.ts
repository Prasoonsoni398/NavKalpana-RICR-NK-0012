import { api } from "../lib/api";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from "@/models/course.model";

class CourseService {
  private baseUrl = "/courses";

  // ✅ CREATE COURSE
  async createCourse(data: CreateCourseRequest): Promise<CourseResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  // ✅ GET ALL COURSES
  async getAllCourses(): Promise<CourseResponse[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  // ✅ GET MY COURSES
  async getMyCourses(): Promise<CourseResponse[]> {
    const response = await api.get(`${this.baseUrl}/my-courses`);
    return response.data;
  }

  // ✅ GET ALL ASSIGNMENTS
  async getAllAssignments(): Promise<any[]> {
    const response = await api.get("/assignments");
    return response.data;
  }

  // 🆕 FILE UPLOAD (Fixed & Completed)
  // Swagger के /file-upload एंडपॉइंट के लिए
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file); // Key का नाम Swagger के हिसाब से 'file' रखा है

    const response = await api.post("/file-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // यह { url: "..." } या { fileUrl: "..." } वापस करेगा
  }

  // 🆕 SUBMIT ASSIGNMENT (As per your Swagger Photo)
  // Swagger: POST /assignments/{id}/submit
  async submitAssignment(id: number | string, data: { 
    fileUrl?: string; 
    textAnswer?: string; 
    externalLink?: string 
  }): Promise<any> {
    const response = await api.post(`/assignments/${id}/submit`, data);
    return response.data;
  }

  // ✅ LEADERBOARD
  async getLeaderboard(): Promise<any[]> {
    const response = await api.get(`${this.baseUrl}/leaderboard`).catch(() => api.get('/leaderboard'));
    return response.data;
  }

  // ✅ GET SINGLE COURSE
  async getCourseById(id: number): Promise<CourseResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ✅ UPDATE COURSE
  async updateCourse(id: number, data: UpdateCourseRequest): Promise<CourseResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // ✅ DELETE COURSE
  async deleteCourse(id: number): Promise<{ deleted: boolean }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // 🆕 QUIZ FUNCTIONS
  async getAllQuizzes(): Promise<any[]> {
    const response = await api.get('/quizzes'); 
    return response.data;
  }

  async startQuiz(quizId: string): Promise<any> {
    const response = await api.post('/quizzes/start', { quizId });
    return response.data;
  }

  async submitQuiz(quizData: any): Promise<any> {
    const response = await api.post('/quizzes/submit', quizData);
    return response.data;
  }
}

export const courseService = new CourseService();