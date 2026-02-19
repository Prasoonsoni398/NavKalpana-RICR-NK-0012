import styles from "@/styles/TeacherDashboard.module.css";
import { COURSES_DATA } from "@/redux/data/data";
import Link from "next/link";

export default function TeacherDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Instructor Console</h1>
        <Link href="/deshboard/teacher-deshboard/add-course">
          <button className={styles.primaryBtn}>+ Create New Course</button>
        </Link>
      </header>

      {/* Stats Section */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Courses</span>
          <h2>{COURSES_DATA.length}</h2>
        </div>
        <div className={styles.statCard}>
          <span>Students</span>
          <h2>1,240</h2>
        </div>
        <div className={styles.statCard}>
          <span>Revenue</span>
          <h2>$8,450.00</h2>
        </div>
        <div className={styles.statCard}>
          <span>rating</span>
          <h2>4.9</h2>
        </div>
      </div>

      {/* Course List Table */}
      <div className={styles.tableSection}>
        <h3>Your Published Courses</h3>
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COURSES_DATA.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>${course.price}</td>
                <td><span className={styles.statusBadge}>Live</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}