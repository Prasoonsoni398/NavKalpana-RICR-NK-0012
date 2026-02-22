import { api } from "../lib/api";
import type {
  Quiz,
  QuizDetailResponse,
  StartQuizAttemptRequest,
  StartQuizAttemptResponse,
  SubmitQuizAttemptRequest,
  SubmitQuizAttemptResponse,
} from "@/models/quiz.model";

class QuizService {
  private baseUrl = "/quizzes";

  // --------------------
  // Get all quizzes
  // --------------------
  async getAll(): Promise<Quiz[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  // --------------------
  // Get quiz details (for student)
  // --------------------
  async getById(id: number): Promise<QuizDetailResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // --------------------
  // Start quiz attempt
  // --------------------
  async startAttempt(
    data: StartQuizAttemptRequest
  ): Promise<StartQuizAttemptResponse> {
    const response = await api.post(`${this.baseUrl}/start`, data);
    return response.data;
  }

  // --------------------
  // Submit quiz
  // --------------------
  async submitAttempt(
    data: SubmitQuizAttemptRequest
  ): Promise<SubmitQuizAttemptResponse> {
    const response = await api.post(`${this.baseUrl}/submit`, data);
    return response.data;
  }
}

export const quizService = new QuizService();