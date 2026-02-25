"use client";

import { useState } from "react";
import styles from "@/styles/Auth.module.css";
import { authService } from "@/services/auth.services";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setTokens } from "@/redux/globalSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { Eye, EyeOff } from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

      // Save student info locally
      const studentData = {
        name:
          res.user?.name ||
          (res as any).student?.name ||
          "Student",
        email:
          res.user?.email ||
          (res as any).student?.email ||
          form.email,
      };

      localStorage.setItem(
        "student_info",
        JSON.stringify(studentData)
      );

      // Save to Redux
      dispatch(
        setTokens({
          accessToken: token,
          refreshToken: "",
        })
      );

      // Save token in Cookie
      document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;

      toast.success("Welcome 🎉 Login successful!", {
        id: toastId,
      });

      setTimeout(() => {
        router.push("/student/student-dashboard");
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Student Login</h2>
          <p className={styles.subtitle}>
            Welcome back! Please enter your details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.formElement}
        >
          {/* EMAIL FIELD */}
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              type="email"
              placeholder="name@gmail.com"
              variant="outlined"
              sx={muiThemeStyles}
            />
          </div>

          {/* PASSWORD FIELD WITH EYE BUTTON */}
          <div className={styles.formGroup}>
            <label>Password</label>
            <TextField
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              variant="outlined"
              sx={muiThemeStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
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
            <div className={styles.forgotPass}>
              <Link href="./forget-password">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>OR</div>

        <button
          className={styles.googleBtn}
          type="button"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <p className={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/auth/student-signup">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

// MUI Theme Styles
const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
    "& fieldset": {
      borderColor: "var(--border-light)",
    },
    "&:hover fieldset": {
      borderColor: "var(--primary-yellow)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--primary-yellow)",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "var(--text-secondary)",
    opacity: 1,
  },
};