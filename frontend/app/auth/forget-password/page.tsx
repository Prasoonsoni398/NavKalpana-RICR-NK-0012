"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/ForgetPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      setMessage("");
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Password reset link sent to your email!");
    setEmail("");
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotCard}>
        <h2>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>

        <Link href="/auth/login" className={styles.backLogin}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
