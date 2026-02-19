"use client";

import { useState } from 'react';
import styles from '@/styles/Auth.module.css';

export default function StudentAuth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Student Portal</h2>

        {/* Toggle Switch */}
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggleSlider} ${!isLogin ? styles.sliderRight : ''}`}></div>
          <button 
            className={`${styles.toggleBtn} ${isLogin ? styles.activeToggle : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`${styles.toggleBtn} ${!isLogin ? styles.activeToggle : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form Content */}
        <form>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
          )}
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" placeholder="Enter email" required />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>
          <button type="submit" className={styles.loginBtn}>
            {isLogin ? 'Login to Account' : 'Create Account'}
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