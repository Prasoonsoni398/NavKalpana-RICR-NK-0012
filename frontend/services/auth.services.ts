// Login API Call Function
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch('http://31.97.207.88:6200/auth/login/student', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error: any) {
    throw error.message;
  }
};