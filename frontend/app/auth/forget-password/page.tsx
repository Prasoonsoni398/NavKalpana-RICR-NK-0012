"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/styles/ForgetPassword.module.css";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Send OTP
  const handleSendOtp = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setError("");
    setMessage("OTP sent to your email!");
    setOtpSent(true);
    setTimer(30);
    setCanResend(false);

    // Backend call here
  };

  // Resend OTP
  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setMessage("OTP resent successfully!");

    // Backend call here
  };

  // OTP input change
  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter 6 digit OTP");
      return;
    }

    setError("");
    setMessage("OTP verified successfully!");

    // Clear OTP inputs
    setOtp(["", "", "", "", "", ""]);

    // Redirect after 2 sec
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotCard}>
        <h2>Forgot Password</h2>

        {!otpSent ? (
          <>
            <p className={styles.subtitle}>
              Enter your email to receive OTP
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button onClick={handleSendOtp} className={styles.button}>
              Send OTP
            </button>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className={styles.subtitle}>
              Enter the 6-digit OTP
            </p>

            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  className={styles.otpInput}
                />
              ))}
            </div>

            {/* Timer / Resend */}
            {!canResend ? (
              <p className={styles.timer}>
                Resend OTP in {timer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className={styles.resend}
              >
                Resend OTP
              </button>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" className={styles.button}>
              Verify OTP
            </button>
          </form>
        )}

        <Link href="/auth/login" className={styles.backLogin}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
