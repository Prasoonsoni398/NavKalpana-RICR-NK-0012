"use client";

import { useState } from "react";
import styles from "@/styles/ChangePassword.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.newPass);
  const isNewPasswordValid = validatePassword(formData.newPass);
  const doPasswordsMatch = formData.newPass === formData.confirm;
  const isFormValid = isNewPasswordValid && doPasswordsMatch && formData.current.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage("Password updated successfully! 🎉");
      setFormData({ current: "", newPass: "", confirm: "" });
      setTouched({ current: false, new: false, confirm: false });
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Change Password</h2>
          <p className={styles.subtitle}>Secure your account with a strong password</p>

          {/* Current Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Current Password
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="current"
                value={formData.current}
                onChange={handleChange}
                onBlur={() => handleBlur('current')}
                placeholder="Enter current password"
                className={`${styles.input} ${touched.current && !formData.current ? styles.error : ''}`}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('current')}
                aria-label={showPasswords.current ? "Hide password" : "Show password"}
              >
                {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {touched.current && !formData.current && (
              <span className={styles.errorMessage}>Current password is required</span>
            )}
          </div>

          {/* New Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              New Password
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPass"
                value={formData.newPass}
                onChange={handleChange}
                onBlur={() => handleBlur('new')}
                placeholder="Enter new password"
                className={`${styles.input} ${touched.new && !isNewPasswordValid ? styles.error : ''}`}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showPasswords.new ? "Hide password" : "Show password"}
              >
                {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPass && (
              <div className={styles.strengthIndicator}>
                <div className={styles.strengthBars}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`${styles.strengthBar} ${
                        passwordStrength >= level ? styles.active : ''
                      }`}
                      style={{
                        backgroundColor: passwordStrength >= level 
                          ? passwordStrength <= 2 ? '#EF4444'
                            : passwordStrength <= 3 ? '#F59E0B'
                            : passwordStrength <= 4 ? '#3B82F6'
                            : '#10B981'
                          : '#E2E8F0'
                      }}
                    />
                  ))}
                </div>
                <span className={styles.strengthText}>
                  {passwordStrength <= 2 ? 'Weak' 
                    : passwordStrength <= 3 ? 'Fair'
                    : passwordStrength <= 4 ? 'Good'
                    : 'Strong'} Password
                </span>
              </div>
            )}

            {touched.new && !isNewPasswordValid && (
              <div className={styles.passwordRequirements}>
                <p className={styles.requirementsTitle}>Password must contain:</p>
                <ul className={styles.requirementsList}>
                  <li className={formData.newPass.length >= 8 ? styles.met : ''}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(formData.newPass) ? styles.met : ''}>
                    ✓ One lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(formData.newPass) ? styles.met : ''}>
                    ✓ One uppercase letter
                  </li>
                  <li className={/\d/.test(formData.newPass) ? styles.met : ''}>
                    ✓ One number
                  </li>
                  <li className={/[@$!%*?&]/.test(formData.newPass) ? styles.met : ''}>
                    ✓ One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Confirm Password
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                onBlur={() => handleBlur('confirm')}
                placeholder="Confirm new password"
                className={`${styles.input} ${touched.confirm && !doPasswordsMatch ? styles.error : ''}`}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
              >
                {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {touched.confirm && formData.confirm && !doPasswordsMatch && (
              <span className={styles.errorMessage}>Passwords do not match</span>
            )}
          </div>

          {/* API Error / Success Message */}
          {error && (
            <div className={styles.apiError}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}
          
          {message && (
            <div className={styles.apiSuccess}>
              <span className={styles.successIcon}>✅</span>
              {message}
            </div>
          )}

          <button
            type="submit"
            className={`${styles.submitButton} ${(!isFormValid || loading) ? styles.disabled : ''}`}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Updating Password...
              </>
            ) : (
              'Save Changes'
            )}
          </button>

          <div className={styles.securityNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Your password is encrypted and secure</span>
          </div>
        </form>
      </div>
    </div>
  );
}