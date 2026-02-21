import { api } from "../lib/api";
import type { StudentLoginRequest,StudentLoginResponse } from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

// Student Login
async login(
  data: StudentLoginRequest
): Promise<StudentLoginResponse> {
  const response = await api.post(`${this.baseUrl}/login/student`, data);
  return response.data;
}
 
}

export const authService = new AuthService();