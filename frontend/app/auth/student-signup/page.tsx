"use client";

import { useState } from 'react';
import styles from '@/styles/Auth.module.css';
import { authService } from '@/services/auth.services';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import toast from "react-hot-toast";

export default function StudentSignup() {
  const router = useRouter(); 

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState(''); 
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // अगर OTP अभी नहीं भेजा गया है, तो पहले रजिस्ट्रेशन/OTP जनरेट करें
    if (!isOtpSent) {
      const toastId = toast.loading("Sending OTP to your email...");
      try {
        await authService.signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast.success("OTP sent successfully! 📧", { id: toastId });
        setIsOtpSent(true); // OTP वाला सेक्शन दिखाएँ
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Check your API path (404 Error)";
        toast.error(errorMsg, { id: toastId });
      } finally {
        setLoading(false);
      }
    } else {
      const toastId = toast.loading("Verifying OTP...");
      try {
        await authService.verifyOtp({
          email: form.email,
          otp: otp
        });

        toast.success("Account verified! redirecting...", { id: toastId });
        setTimeout(() => router.push("/auth/student-login"), 1500);
      } catch (err: any) {
        console.error("Verification Error:", err.response?.data);
        
        const msg = err?.response?.data?.message || "Invalid OTP";
        toast.error(msg, { id: toastId });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Student <span>{isOtpSent ? 'Verification' : 'Signup'}</span></h2>
          <p className={styles.subtitle}>
            {isOtpSent ? `Enter the OTP sent to ${form.email}` : 'Fill in your details to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formElement}>
          {!isOtpSent ? (
            /* --- स्टेप 1: रजिस्ट्रेशन फॉर्म --- */
            <>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <TextField name="name" value={form.name} onChange={handleChange} required fullWidth variant="outlined" sx={muiThemeStyles} />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <TextField name="email" value={form.email} onChange={handleChange} required fullWidth type="email" variant="outlined" sx={muiThemeStyles} />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <TextField name="password" value={form.password} onChange={handleChange} fullWidth required type="password" variant="outlined" sx={muiThemeStyles} />
              </div>
            </>
          ) : (
            /* --- स्टेप 2: OTP इनपुट सेक्शन --- */
            <div className={styles.formGroup}>
              <label>Enter 6-Digit OTP</label>
              <TextField
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                fullWidth
                placeholder="0 0 0 0 0 0"
                variant="outlined"
                sx={muiThemeStyles}
              />
              <p className={styles.resendText} onClick={() => setIsOtpSent(false)} style={{cursor:'pointer', color:'var(--primary-yellow)', fontSize:'0.8rem', marginTop:'10px'}}>
                Wrong email? Edit details
              </p>
            </div>
          )}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Processing...' : (isOtpSent ? 'Verify & Register' : 'Get OTP')}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/auth/student-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
    "& fieldset": { borderColor: "var(--border-light)" },
    "&:hover fieldset": { borderColor: "var(--primary-yellow)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary-yellow)" },
  },
};