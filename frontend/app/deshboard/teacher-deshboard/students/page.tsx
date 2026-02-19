import styles from "@/styles/MyCourses.module.css"; // हम वही टेबल स्टाइल इस्तेमाल करेंगे
import { STUDENTS_DATA } from "@/redux/data/studentData";

export default function StudentsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Student Directory</h1>
          <p>Manage and view details of all students enrolled in your courses.</p>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email Address</th>
              <th>Joined Date</th>
              <th>Courses</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS_DATA.map((student) => (
              <tr key={student.id}>
                <td style={{ fontWeight: "600" }}>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.joinedDate}</td>
                <td>{student.enrolledCourses} Courses</td>
                <td>
                  <span className={styles.statusBadge} style={{
                    backgroundColor: student.status === "Active" ? "#e8f5e9" : "#ffebee",
                    color: student.status === "Active" ? "#2e7d32" : "#d32f2f"
                  }}>
                    {student.status}
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
