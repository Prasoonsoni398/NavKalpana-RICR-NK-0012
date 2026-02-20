import { api } from "../lib/api";
import type { Changepasswordrequest } from "@/models/user.model";

class UserService {
  private baseUrl = "/users";

  // CHANGE PASSWORD
  async changepassword(
    data: Changepasswordrequest
  ): Promise<{ message: string }> {
    const response = await api.post(
      `${this.baseUrl}/change-password`,
      data
    );
    return response.data;
  }
}

export const userService = new UserService();