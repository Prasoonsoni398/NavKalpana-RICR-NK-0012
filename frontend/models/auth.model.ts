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

export interface StudentLoginRequest {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}


