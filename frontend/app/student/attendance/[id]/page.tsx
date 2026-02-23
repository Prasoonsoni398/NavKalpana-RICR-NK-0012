"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "@/styles/Attendance.module.css";

// --- Types ---
interface AttendanceHistory {
  [key: string]: "Present" | "Absent";
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<any>(new Date());

  // Dummy Data
  const courses = [
    { name: "Full Stack Development", present: 32, total: 40 },
    { name: "UI/UX Design", present: 15, total: 20 },
    { name: "Data Structures", present: 8, total: 10 },
    { name: "Machine Learning", present: 12, total: 15 },
    { name: "Cybersecurity", present: 20, total: 25 },
    { name: "Cloud Computing", present: 10, total: 12 },
    { name: "Blockchain", present: 5, total: 8 },
  ];

  const attendanceHistory: AttendanceHistory = {
    "2026-02-01": "Present",
    "2026-02-02": "Absent",
    "2026-02-03": "Present",
    "2026-02-04": "Present",
    "2026-02-18": "Present",
    "2026-02-19": "Absent",
  };

  // Logic to highlight calendar days
  const tileClassName = ({ date, view }: any) => {
    if (view === "month") {
      // Local date को YYYY-MM-DD फॉर्मेट में बदलने का सही तरीका
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      const dateStr = adjustedDate.toISOString().split("T")[0];

      if (attendanceHistory[dateStr] === "Present") return styles.tilePresent;
      if (attendanceHistory[dateStr] === "Absent") return styles.tileAbsent;
    }
  };

  // --- Main Render (अब यह AttendancePage के अंदर है) ---
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Attendance <span>Dashboard</span></h1>

      <div className={styles.topLayout}>
        {/* Course-wise Progress Section */}
        <div className={styles.courseScrollWrapper}>
          <div className={styles.courseGrid}>
            {courses.map((course, index) => {
              const percentage = Math.round((course.present / course.total) * 100);
              return (
                <div key={index} className={styles.courseCard}>
                  <h3>{course.name}</h3>
                  <div className={styles.circularProgress} style={{
                    background: `conic-gradient(#FACC15 ${percentage * 3.6}deg, #e2e8f0 0deg)`
                  }}>
                    <div className={styles.innerCircle}>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                  <div className={styles.cardStats}>
                    <p>Present: <strong>{course.present}</strong></p>
                    <p>Total: <strong>{course.total}</strong></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Calendar Section */}
        <div className={styles.calendarCard}>
          <h2>Monthly Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            className={styles.customCalendar}
          />
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.dotPresent}></span> Present
            </div>
            <div className={styles.legendItem}>
              <span className={styles.dotAbsent}></span> Absent
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={styles.historyCard}>
        <h2>Detailed History</h2>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attendanceHistory).reverse().map(([date, status], index) => (
                <tr key={index}>
                  <td>{date}</td>
                  <td>
                    <span className={status === "Present" ? styles.presentTag : styles.absentTag}>
                      {status}
                    </span>
                  </td>
                  <td>{status === "Present" ? "Regular Session" : "Self Study / Medical"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}