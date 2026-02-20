"use client";

import { useState } from 'react';
import styles from '@/styles/Auth.module.css';
import { StudentSignupRequest } from '@/models/auth.model';
import { TextField } from '@mui/material';
import Link from 'next/link';

export default function StudentSignup() {
  const [form, setForm] = useState<StudentSignupRequest>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle input change
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
      const res = await userSignup(form);
      setMessage(res.message || 'OTP sent to your email!');
      setForm({ name: '', email: '', password: '' }); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Create Student Account</h2>
          <p className={styles.subtitle}>Join our community and start learning today.</p>
        </div>

        {/* Error / Message */}
        {error && <p className={styles.errorMsg}>{error}</p>}
        {message && <p className={styles.successMsg}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.formElement}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <TextField
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              type="email"
              placeholder="example@gmail.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <TextField
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}>OR</div>

        <button className={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign up with Google
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link href="/auth/student-login">Login</Link>
        </p>
      </div>
    </div>
  );
}