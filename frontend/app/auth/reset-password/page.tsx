"use client";

import { useState } from "react";
import styles from "@/styles/ResetPassword.module.css";
import { FiEye } from "react-icons/fi";

export default function ResetPassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [hoverCurrent, setHoverCurrent] = useState(false);
  const [hoverNew, setHoverNew] = useState(false);
  const [hoverConfirm, setHoverConfirm] = useState(false);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const isFormValid =
    validatePassword(newPass) &&
    newPass === confirm &&
    current.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    alert("Password updated successfully!");
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Reset Password</h2>

        {/* Current Password */}
        <div className={styles.inputWrapper}>
          <input
            type={hoverCurrent ? "text" : "password"}
            placeholder="Current Password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.eye}
            onMouseEnter={() => setHoverCurrent(true)}
            onMouseLeave={() => setHoverCurrent(false)}
          >
            <FiEye />
          </span>
        </div>

        {/* New Password */}
        <div className={styles.inputWrapper}>
          <input
            type={hoverNew ? "text" : "password"}
            placeholder="Enter New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.eye}
            onMouseEnter={() => setHoverNew(true)}
            onMouseLeave={() => setHoverNew(false)}
          >
            <FiEye />
          </span>
        </div>

        {/* Live Validation */}
        {newPass && !validatePassword(newPass) && (
          <p className={styles.error}>
            Must be 8+ characters, include uppercase, lowercase,
            number & special character.
          </p>
        )}

        {/* Confirm Password */}
        <div className={styles.inputWrapper}>
          <input
            type={hoverConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
            required
          />
          <span
            className={styles.eye}
            onMouseEnter={() => setHoverConfirm(true)}
            onMouseLeave={() => setHoverConfirm(false)}
          >
            <FiEye />
          </span>
        </div>

        {confirm && newPass !== confirm && (
          <p className={styles.error}>Passwords do not match</p>
        )}

        <button
          type="submit"
          className={`${styles.button} ${
            !isFormValid ? styles.disabled : ""
          }`}
          disabled={!isFormValid}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
