"use client";

import { useState } from 'react';
import styles from '@/styles/Auth.module.css';
import { loginUser } from '@/services/auth.services';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

export default function StudentLogin() {
  const router = useRouter(); 
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 1. API Call
      const res = await loginUser({ 
        email: form.email, 
        password: form.password 
      });

      const token = res.data?.accessToken|| res.accessToken; 
      
      if (token) {
        localStorage.setItem('studentToken', token); 
        setMessage('Login successful! Redirecting...');
        
        // 3. Redirect to Dashboard
        setTimeout(() => {
          router.push('/dashboard/student');
        }, 1500);
      } else {
        throw new Error("Token not received from server");
      }
      
    } catch (err) {

      const errorMessage = err?.response?.data?.message || err.message || 'Invalid email or password!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper} style={{ backgroundColor: '#0F172A' }}>
      <div className={styles.authCard} style={{ backgroundColor: '#1E293B' }}>
        <div className={styles.headerSection}>
          <h2 className={styles.title} style={{ color: '#E2E8F0' }}>Student Login</h2>
          <p className={styles.subtitle} style={{ color: '#94A3B8' }}>Welcome back! Please enter your details.</p>
        </div>

        {error && <p className={styles.errorMsg} style={{ color: '#EF4444' }}>{error}</p>}
        {message && <p className={styles.successMsg} style={{ color: '#22C55E' }}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.formElement}>
          <div className={styles.formGroup}>
            <label style={{ color: '#E2E8F0' }}>Email Address</label>
            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              type="email"
              placeholder="name@gmail.com"
              variant="outlined"
              sx={muiDarkStyles} 
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ color: '#E2E8F0' }}>Password</label>
            <TextField
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              type="password"
              placeholder="••••••••"
              variant="outlined"
              sx={muiDarkStyles}
            />
            <div className={styles.forgotPass}>
                <Link href="/auth/forgot-password" style={{ color: '#3B82F6' }}>Forgot password?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.loginBtn} 
            disabled={loading}
            style={{ backgroundColor: loading ? '#334155' : '#3B82F6' }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider} style={{ color: '#94A3B8' }}>OR</div>

        <button className={styles.googleBtn} type="button" style={{ background: 'white' }}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <p className={styles.footerText} style={{ color: '#94A3B8' }}>
          Don't have an account? <Link href="/auth/student-signup" style={{ color: '#3B82F6' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}


const muiDarkStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#E2E8F0",
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#3B82F6" },
    "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
  },
  "& .MuiInputBase-input::placeholder": { color: "#94A3B8", opacity: 1 }
};