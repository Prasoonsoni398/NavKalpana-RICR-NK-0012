"use client";

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import styles from '@/styles/Auth.module.css';

export default function TeacherLogin() {

    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authCard} style={{ borderTopColor: '#4CAF50' }}>
                <h2 className={styles.title}>Teacher Portal</h2>

                {/* toggle switch */}

                <div className={styles.toggleContainer}>
                    <div className={`${styles.toggleSlider} ${!isLogin ? styles.sliderRight : ''}`}></div>
                    <button
                        className={`${styles.toggleBtn} ${isLogin ? styles.activeToggle : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${!isLogin ? styles.activeToggle : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {/* form content */}

                <form>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <TextField
                                required
                                id="outlined-name"
                                label="Full Name"
                            />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label>Teacher ID / Email</label>
                        <TextField
                            required
                            id="outlined-Email"
                            label="Email Address"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Secret Token</label>
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className={styles.loginBtn}>Login as Teacher</button>
                </form>

                <div className={styles.divider}>OR</div>

                <button className={styles.googleBtn}>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className={styles.googleIcon}
                    />
                    {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
            </div>
        </div>
    );
}



