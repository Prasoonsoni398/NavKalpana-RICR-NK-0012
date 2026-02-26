"use client";

import { useState, useEffect } from 'react';
import styles from '@/styles/Auth.module.css';
import { authService } from '@/services/auth.services';
import { TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentSignup() {
  const router = useRouter(); 

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    const password = form.password;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [form.password]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const passwordsMatch = () => {
    return form.password === form.confirmPassword;
  };

  const isFormValid = () => {
    return (
      validateName(form.name) &&
      validateEmail(form.email) &&
      validatePassword(form.password) &&
      passwordsMatch()
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus appropriate input
      const focusIndex = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${focusIndex}`)?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const toastId = toast.loading("Resending OTP...");
    
    try {
      await authService.resendOtp({ email: "string" });
      toast.success("OTP resent successfully!", { id: toastId });
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields if not in OTP stage
    if (!isOtpSent) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true
      });

      if (!isFormValid()) {
        toast.error("Please fix the errors in the form");
        return;
      }
    }

    setLoading(true);
    
    if (!isOtpSent) {
      const toastId = toast.loading("Sending OTP to your email...");
      try {
        await authService.signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast.success("OTP sent successfully! 📧", { id: toastId });
        setIsOtpSent(true);
        setTimer(60);
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || "Failed to send OTP";
        toast.error(errorMsg, { id: toastId });
      } finally {
        setLoading(false);
      }
    } else {
      const toastId = toast.loading("Verifying OTP...");
      try {
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
          throw new Error("Please enter complete OTP");
        }

        await authService.verifyOtp({
          email: form.email,
          otp: otpValue
        });

        toast.success("Account verified! Redirecting to login...", { 
          id: toastId,
          icon: '🎉',
          duration: 3000
        });
        
        setTimeout(() => router.push("/auth/student-login"), 2000);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Invalid OTP";
        toast.error(msg, { id: toastId });
        
        // Shake animation on error
        const otpContainer = document.querySelector(`.${styles.otpContainer}`);
        otpContainer?.classList.add(styles.shake);
        setTimeout(() => {
          otpContainer?.classList.remove(styles.shake);
        }, 500);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#EF4444';
    if (passwordStrength <= 3) return '#F59E0B';
    if (passwordStrength <= 4) return '#3B82F6';
    return '#10B981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>
      
      <div className={styles.authCard}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Edu</span>
            <span className={styles.logoHighlight}>Learn</span>
          </div>
        </div>

        <div className={styles.headerSection}>
          <h2 className={styles.title}>
            {isOtpSent ? 'Verify Email' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {isOtpSent 
              ? `Enter the 6-digit code sent to ${form.email}`
              : 'Fill in your details to get started'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formElement}>
          {!isOtpSent ? (
            <>
              {/* Full Name Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} className={styles.labelIcon} />
                  Full Name
                </label>
                <TextField
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  required
                  fullWidth
                  placeholder="Enter your full name"
                  variant="outlined"
                  error={touched.name && !validateName(form.name)}
                  helperText={touched.name && !validateName(form.name) ? "Name must be at least 2 characters" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                  }}
                />
                {touched.name && validateName(form.name) && form.name && (
                  <span className={styles.validIndicator}>
                    <CheckCircle size={16} color="#10B981" />
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} className={styles.labelIcon} />
                  Email Address
                </label>
                <TextField
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  required
                  fullWidth
                  type="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  error={touched.email && !validateEmail(form.email)}
                  helperText={touched.email && !validateEmail(form.email) ? "Please enter a valid email" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                  }}
                />
                {touched.email && validateEmail(form.email) && form.email && (
                  <span className={styles.validIndicator}>
                    <CheckCircle size={16} color="#10B981" />
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Lock size={16} className={styles.labelIcon} />
                  Password
                </label>
                <TextField
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  variant="outlined"
                  error={touched.password && !validatePassword(form.password)}
                  helperText={touched.password && !validatePassword(form.password) ? "Password must be at least 6 characters" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          className={styles.eyeButton}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBars}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`${styles.strengthBar} ${passwordStrength >= level ? styles.active : ''}`}
                          style={{
                            backgroundColor: passwordStrength >= level ? getPasswordStrengthColor() : '#E2E8F0'
                          }}
                        />
                      ))}
                    </div>
                    <span className={styles.strengthText} style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()} password
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Lock size={16} className={styles.labelIcon} />
                  Confirm Password
                </label>
                <TextField
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  fullWidth
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  variant="outlined"
                  error={touched.confirmPassword && !passwordsMatch()}
                  helperText={touched.confirmPassword && !passwordsMatch() ? "Passwords do not match" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          className={styles.eyeButton}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {touched.confirmPassword && passwordsMatch() && form.confirmPassword && (
                  <span className={styles.validIndicator}>
                    <CheckCircle size={16} color="#10B981" />
                  </span>
                )}
              </div>
            </>
          ) : (
            /* OTP Verification Section */
            <div className={styles.otpSection}>
              <label className={styles.label}>6-Digit Verification Code</label>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={styles.otpInput}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className={styles.timerSection}>
                {!canResend ? (
                  <p className={styles.timer}>
                    Resend code in <span>{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={styles.resendButton}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Edit Email Link */}
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className={styles.editEmailButton}
              >
                <AlertCircle size={14} />
                Wrong email? Edit details
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className={`${styles.loginBtn} ${loading ? styles.loading : ''}`}
            disabled={loading || (!isOtpSent && !isFormValid())}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Processing...</span>
              </>
            ) : (
              isOtpSent ? 'Verify & Create Account' : 'Get OTP'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footerText}>
          Already have an account?{' '}
          <Link href="/auth/student-login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s ease",
    "& fieldset": { 
      borderColor: "var(--border-light)",
      borderWidth: "2px",
    },
    "&:hover fieldset": { 
      borderColor: "var(--primary-yellow)" 
    },
    "&.Mui-focused fieldset": { 
      borderColor: "var(--primary-yellow)",
      borderWidth: "2px",
    },
    "&.Mui-error fieldset": {
      borderColor: "#EF4444",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 14px 14px 0",
    "&::placeholder": {
      color: "var(--text-secondary)",
      opacity: 0.7,
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0",
    color: "#EF4444",
    fontSize: "0.75rem",
  },
};