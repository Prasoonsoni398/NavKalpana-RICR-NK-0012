import styles from "@/styles/MyCourses.module.css";
import { COURSES_DATA } from "@/redux/data/data";
import Link from "next/link";

export default function MyCoursesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Courses</h1>
          <p>View and manage all your published courses in one place.</p>
        </div>
        <Link href="/deshboard/teacher-deshboard/add-course">
          <button className={styles.primaryBtn}>+ Create New Course</button>
        </Link>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {COURSES_DATA.map((course) => (
              <tr key={course.id}>
                <td className={styles.titleCell}>{course.title}</td>
                <td>{course.instructor}</td>
                <td className={styles.priceCell}>${course.price}</td>
                <td><span className={styles.statusBadge}>Active</span></td>
                <td className={styles.actionCell}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}