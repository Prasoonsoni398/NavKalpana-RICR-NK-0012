"use client";

import styles from "@/styles/Attendance.module.css";

export default function AttendancePage() {
  const totalClasses = 40;
  const presentDays = 32;
  const percentage = Math.round((presentDays / totalClasses) * 100);

  const history = [
    { date: "01 Feb 2026", status: "Present" },
    { date: "02 Feb 2026", status: "Absent" },
    { date: "03 Feb 2026", status: "Present" },
    { date: "04 Feb 2026", status: "Present" },
  ];

  return (
    <div className={styles.container}>
      <h1>Attendance Overview</h1>

      {/* Course Attendance */}
      <div className={styles.card}>
        <h2>Full Stack Development</h2>

        <div className={styles.progressWrapper}>
          <div className={styles.circle}>
            <span>{percentage}%</span>
          </div>

          <div className={styles.stats}>
            <p><strong>Present:</strong> {presentDays}</p>
            <p><strong>Total Classes:</strong> {totalClasses}</p>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className={styles.card}>
        <h2>Monthly Summary (February)</h2>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryBox}>
            <span>Present Days</span>
            <strong>18</strong>
          </div>

          <div className={styles.summaryBox}>
            <span>Absent Days</span>
            <strong>2</strong>
          </div>

          <div className={styles.summaryBox}>
            <span>Attendance %</span>
            <strong>90%</strong>
          </div>
        </div>
      </div>

      {/* History */}
      <div className={styles.card}>
        <h2>Attendance History</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>
                  <span
                    className={
                      item.status === "Present"
                        ? styles.present
                        : styles.absent
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}