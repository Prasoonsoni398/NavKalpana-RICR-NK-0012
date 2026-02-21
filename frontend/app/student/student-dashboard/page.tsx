import styles from '@/styles/StudentDashboard.module.css';

export default function StudentDashboard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Welcome back, Learner! 👋</h1>
          <p className={styles.subtitle}>Track your progress and continue where you left off.</p>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.subtitle}>Enrolled Courses</p>
            <span className={styles.statValue}>04</span>
          </div>
          <div className={styles.statCard}>
            <p className={styles.subtitle}>Completed Lessons</p>
            <span className={`${styles.statValue}`} style={{ color: '#22C55E' }}>28</span>
          </div>
          <div className={styles.statCard}>
            <p className={styles.subtitle}>Points Earned</p>
            <span className={`${styles.statValue}`} style={{ color: '#6366F1' }}>1,250</span>
          </div>
        </div>

        {/* Continue Learning */}
        <section className={styles.courseSection}>
          <h2>Continue Learning</h2>
          <div className={styles.resumeCard}>
            <div className={styles.cardTop}>
              <h3>Advanced React & Next.js 14</h3>
              <button className={styles.resumeBtn}>Resume Lesson</button>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '60%' }}></div>
            </div>
            <p className={styles.subtitle} style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              60% Completed • 4 lessons remaining
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}