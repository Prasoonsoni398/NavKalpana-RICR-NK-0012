// --------------------
// USER SIGNUP
// --------------------
export interface StudentSignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserSignupResponse {
  message: string;
  userId: number;
}

