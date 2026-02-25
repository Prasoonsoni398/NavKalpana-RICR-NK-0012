import { api } from "../lib/api";
import type {
  AssignmentWithSubmissionResponse,
  SubmissionData,
} from "@/models/assignment-submission.model";

class AssignmentService {
  private baseUrl = "/assignments";

  // 🔥 Get All Assignments
  async getAll() {
    const response = await api.get(`${this.baseUrl}`);
    return response.data;
  }

  // 🔥 Get Single Assignment
  async getById(id: number) {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // 🔥 Submit Assignment
  async submit(
    assignmentId: number,
    formData: FormData
  ): Promise<SubmissionData> {
    const response = await api.post(
      `${this.baseUrl}/${assignmentId}/submit`,
      formData
    );

    return response.data;
  }

  // 🔥 Evaluate Submission (Instructor)
  async evaluate(
    submissionId: number,
    data: { marks: number; feedback: string }
  ): Promise<SubmissionData> {
    const response = await api.patch(
      `${this.baseUrl}/evaluate/${submissionId}`,
      data
    );

    return response.data;
  }

  // 🔥 Get Assignment With Student Submission
  async getAssignmentWithSubmission(
    assignmentId: number
  ): Promise<AssignmentWithSubmissionResponse> {
    const response = await api.get(
      `${this.baseUrl}/my-assignment/${assignmentId}`
    );

    return response.data;
  }

  // ✅ 🔥 NEW: Request Revaluation
  async requestRevaluation(submissionId: number) {
    const response = await api.post(
      `${this.baseUrl}/revaluation/${submissionId}`
    );

    return response.data;
  }
}

export const assignmentService = new AssignmentService();