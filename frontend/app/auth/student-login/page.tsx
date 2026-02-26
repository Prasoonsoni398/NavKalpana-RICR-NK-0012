"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/Auth.module.css";
import { authService } from "@/services/auth.services";
import {
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setTokens } from "@/redux/globalSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Load saved email if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (touched[name as keyof typeof touched]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    if (field === 'email' && form.email && !validateEmail(form.email)) {
      setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
    if (field === 'password' && form.password && !validatePassword(form.password)) {
      setFormErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid = () => {
    return validateEmail(form.email) && validatePassword(form.password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    setTouched({ email: true, password: true });
    
    if (!validateEmail(form.email)) {
      setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    }
    if (!validatePassword(form.password)) {
      setFormErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
    }
    
    if (!isFormValid()) return;

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });

      const token = res?.accessToken;

      if (!token) {
        throw new Error("Token not received from server");
      }

      // Handle "Remember Me"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Save student info locally
      const studentData = {
        name: res.user?.name || (res as any).student?.name || "Student",
        email: res.user?.email || (res as any).student?.email || form.email,
        id: res.user?.id || (res as any).student?.id,
        role: 'student'
      };

      localStorage.setItem("student_info", JSON.stringify(studentData));
      localStorage.setItem("accessToken", token);

      // Save to Redux
      dispatch(
        setTokens({
          accessToken: token,
          refreshToken: res?.refreshToken || "",
        })
      );

      // Save token in Cookie
      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax; secure`;

      toast.success("Welcome back! 🎉 Login successful!", {
        id: toastId,
        icon: '👋',
        duration: 3000
      });

      // Redirect to dashboard
      router.push("/student/student-dashboard");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password";

      toast.error(errorMessage, { 
        id: toastId,
        icon: '❌',
        duration: 4000
      });
      
      // Shake animation for form
      const formElement = document.querySelector(`.${styles.authCard}`);
      formElement?.classList.add(styles.shake);
      setTimeout(() => {
        formElement?.classList.remove(styles.shake);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      {/* Background decoration */}
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>
      
      <div className={styles.authCard}>
        {/* Logo/Brand */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Skill</span>
            <span className={styles.logoHighlight}>Verse</span>
          </div>
        </div>

        <div className={styles.headerSection}>
          <h2 className={styles.title}>Welcome Back! 👋</h2>
          <p className={styles.subtitle}>
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formElement}>
          {/* EMAIL FIELD */}
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
              error={touched.email && !!formErrors.email}
              helperText={touched.email && formErrors.email}
              sx={muiThemeStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#64748B" />
                  </InputAdornment>
                ),
              }}
            />
            {touched.email && !formErrors.email && form.email && (
              <span className={styles.validIndicator}>
                <CheckCircle size={16} />
              </span>
            )}
          </div>

          {/* PASSWORD FIELD */}
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
              placeholder="Enter your password"
              variant="outlined"
              error={touched.password && !!formErrors.password}
              helperText={touched.password && formErrors.password}
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
                      onClick={togglePasswordVisibility}
                      edge="end"
                      className={styles.eyeButton}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className={styles.row}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: 'var(--border-light)',
                    '&.Mui-checked': {
                      color: 'var(--primary-yellow)',
                    },
                  }}
                />
              }
              label="Remember me"
              className={styles.checkboxLabel}
            />
            <Link href="./forget-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`${styles.loginBtn} ${loading ? styles.loading : ''}`}
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        {/* Google Sign In */}
        <button className={styles.googleBtn} type="button">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>

        {/* Sign Up Link */}
        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link href="/auth/student-signup" className={styles.signupLink}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

// MUI Theme Styles
const muiThemeStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'var(--text-primary)',
    borderRadius: '12px',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'var(--border-light)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--primary-yellow)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary-yellow)',
      borderWidth: '2px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#EF4444',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 14px 14px 0',
    '&::placeholder': {
      color: 'var(--text-secondary)',
      opacity: 0.7,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '0',
    color: '#EF4444',
    fontSize: '0.75rem',
  },
};