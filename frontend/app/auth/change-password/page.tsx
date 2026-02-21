"use client";

import { useState } from "react";
import styles from "@/styles/ChangePassword.module.css";
import { FiEye } from "react-icons/fi";
// import { userService } from "@/services/user.services";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [hoverCurrent, setHoverCurrent] = useState(false);
  const [hoverNew, setHoverNew] = useState(false);
  const [hoverConfirm, setHoverConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const isFormValid =
    validatePassword(newPass) &&
    newPass === confirm &&
    current.length > 0;

  // ✅ API CALL ADDED HERE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await userService.changepassword({
        oldpassword: current,
        newpassword: newPass,
        confirmpassword:confirm,
      });

      setMessage(res.message || "Password updated successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Change Password</h2>

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

        {/* API Error / Success Message */}
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <button
          type="submit"
          className={`${styles.button} ${
            !isFormValid ? styles.disabled : ""
          }`}
          disabled={!isFormValid || loading}
        >
          {loading ? "Please wait..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}