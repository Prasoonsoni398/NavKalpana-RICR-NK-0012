"use client";

import { useState } from 'react';
import styles from '@/styles/Auth.module.css';
import { authService } from '@/services/auth.services';
import { StudentSignupRequest } from '@/models/auth.model';

export default function StudentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<StudentSignupRequest>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle input change dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // Call login API (to implement later)
        // const res = await authService.userLogin({ email: form.email, password: form.password });
        setMessage('Login functionality coming soon!');
      } else {
        // Call signup API
        const res = await authService.userSignup(form);
        setMessage(res.message || 'OTP sent to your email!');
        setForm({ name: '', email: '', password: '' }); // reset form
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Student Portal</h2>

        {/* Toggle Switch */}
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggleSlider} ${!isLogin ? styles.sliderRight : ''}`}></div>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${isLogin ? styles.activeToggle : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${!isLogin ? styles.activeToggle : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Error / Message */}
        {error && <p className={styles.errorMsg}>{error}</p>}
        {message && <p className={styles.successMsg}>{message}</p>}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login to Account' : 'Create Account'}
          </button>
        </form>

        {/* Google Login Option */}
        <div className={styles.divider}>OR</div>

        <button className={styles.googleBtn}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className={styles.googleIcon} 
          />
          {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
        </button>
      </div>
    </div>
  );
}
