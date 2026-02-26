"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/styles/ForgetPassword.module.css";
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

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
  const handleSendOtp = async () => {
    if (!email) {
      setError({ type: 'email', text: "Please enter your email" });
      return;
    }

    if (!validateEmail(email)) {
      setError({ type: 'email', text: "Please enter a valid email address" });
      return;
    }

    setError({ type: '', text: '' });
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: 'success', text: "OTP sent successfully! Check your email." });
      setOtpSent(true);
      setTimer(30);
      setCanResend(false);
      
      // Focus first OTP input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError({ type: 'api', text: "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimer(30);
      setCanResend(false);
      setMessage({ type: 'success', text: "OTP resent successfully!" });
      setOtp(["", "", "", "", "", ""]);
      
      // Clear error if any
      setError({ type: '', text: '' });
    } catch (err) {
      setError({ type: 'api', text: "Failed to resend OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input change
  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste for OTP
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
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError({ type: 'otp', text: "Please enter all 6 digits" });
      return;
    }

    setError({ type: '', text: '' });
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: 'success', text: "OTP verified successfully! Redirecting..." });

      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);

      // Redirect after 2 sec
      setTimeout(() => {
        router.push("/reset-password");
      }, 2000);
    } catch (err) {
      setError({ type: 'otp', text: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className={styles.backButton}
            aria-label="Go back"
          >
            <FiArrowLeft size={20} />
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              {!otpSent ? <FiMail size={32} /> : <FiLock size={32} />}
            </div>
            <h1 className={styles.title}>
              {!otpSent ? "Forgot Password?" : "Verify OTP"}
            </h1>
            <p className={styles.subtitle}>
              {!otpSent 
                ? "No worries! We'll send you reset instructions." 
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {!otpSent ? (
            /* Email Form */
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} size={18} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${styles.input} ${error.type === 'email' ? styles.error : ''}`}
                    disabled={isLoading}
                  />
                  {isEmailValid && !error.text && (
                    <FiCheckCircle className={styles.validIcon} size={18} />
                  )}
                </div>
                {error.type === 'email' && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={14} />
                    {error.text}
                  </span>
                )}
              </div>

              {message.type === 'success' && (
                <div className={styles.successMessage}>
                  <FiCheckCircle size={16} />
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSendOtp}
                className={`${styles.button} ${isLoading ? styles.loading : ''}`}
                disabled={!isEmailValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          ) : (
            /* OTP Form */
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <div className={styles.otpSection}>
                <label className={styles.label}>6-Digit Code</label>
                <div className={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`${styles.otpInput} ${error.type === 'otp' ? styles.error : ''}`}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  ))}
                </div>

                {error.type === 'otp' && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={14} />
                    {error.text}
                  </span>
                )}

                {/* Timer / Resend */}
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
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {message.type === 'success' && (
                <div className={styles.successMessage}>
                  <FiCheckCircle size={16} />
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                className={`${styles.button} ${isLoading ? styles.loading : ''}`}
                disabled={otp.join("").length !== 6 || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className={styles.footer}>
            <Link href="/auth/student-login" className={styles.backLink}>
              <FiArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={styles.decorativeCircle1}></div>
        <div className={styles.decorativeCircle2}></div>
      </div>
    </div>
  );
}