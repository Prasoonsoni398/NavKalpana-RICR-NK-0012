import { api } from "../lib/api";
import type { 
  StudentLoginRequest, 
  StudentLoginResponse, 
  StudentSignupRequest, 
  StudentSignupResponse  
} from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

  async login(data: StudentLoginRequest): Promise<StudentLoginResponse> {
    const response = await api.post(`${this.baseUrl}/login/student`, data);
    return response.data;
  }

  async signup(data: StudentSignupRequest): Promise<StudentSignupResponse> {
    const response = await api.post(`${this.baseUrl}/signup/student`, data);
    return response.data;
  }

  async verifyOtp(data: { email: string; otp: string }) {
    const response = await api.post(`${this.baseUrl}/verify-otp`, {
      email: data.email,
      code: String(data.otp),
    });
    return response.data;
  }

  // ✅ ADD THIS METHOD
  async resendOtp(data: { email: string }): Promise<{ message: string }> {
    const response = await api.post(`${this.baseUrl}/resend-otp`, {
      email: data.email,
    });
    return response.data;
  }
}

export const authService = new AuthService();