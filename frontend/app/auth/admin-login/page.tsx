import styles from '@/styles/Auth.module.css';

export default function AdminLogin() {
  return (
    <div className={styles.authWrapper} style={{ backgroundColor: '#e8f5e9' }}>
      <div className={styles.authCard} style={{ borderTop: '5px solid #1b5e20' }}>
        <h2 className={styles.title}>System Administration</h2>
        <form>
          <div className={styles.formGroup}>
            <label>Admin Username</label>
            <input type="text" placeholder="Enter admin username" required />
          </div>
          <div className={styles.formGroup}>
            <label>Secure Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className={styles.loginBtn} style={{ backgroundColor: '#1b5e20' }}>
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}