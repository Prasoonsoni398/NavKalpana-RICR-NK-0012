import { api } from "../lib/api";
import type { StudentSignupRequest } from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

  // USER SIGNUP
  async userSignup(
    data: StudentSignupRequest
  ): Promise<any> {
    const response = await api.post<StudentSignupRequest>(
      `${this.baseUrl}/signup/student`,
      data
    );
    return response.data;
  }

}

export const authService = new AuthService();
