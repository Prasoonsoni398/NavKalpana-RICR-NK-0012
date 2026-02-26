"use client";
import { useState } from "react";
import styles from "@/styles/LearningSupport.module.css";

// Example Courses
const courses = [
  "Data Structures & Algorithms",
  "Web Development",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Java Programming",
  "Python Programming",
];

interface SupportRequest {
  type: "Doubt" | "Backup Class";
  course: string;
  topic: string;
  description: string;
  status: string;
}

export default function LearningSupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [filter, setFilter] = useState("All");

  const [doubt, setDoubt] = useState({
    course: "",
    topic: "",
    description: "",
  });

  const [backup, setBackup] = useState({
    course: "",
    topic: "",
    reason: "",
  });

  // Submit Doubt
  const handleDoubtSubmit = () => {
    if (!doubt.course || !doubt.topic || !doubt.description) return;

    setRequests((prev) => [
      ...prev,
      {
        type: "Doubt",
        course: doubt.course,
        topic: doubt.topic,
        description: doubt.description,
        status: "Pending",
      },
    ]);

    setDoubt({ course: "", topic: "", description: "" });
  };

  // Submit Backup Request
  const handleBackupSubmit = () => {
    if (!backup.course || !backup.topic || !backup.reason) return;

    setRequests((prev) => [
      ...prev,
      {
        type: "Backup Class",
        course: backup.course,
        topic: backup.topic,
        description: backup.reason,
        status: "Pending",
      },
    ]);

    setBackup({ course: "", topic: "", reason: "" });
  };

  // Filter Logic
  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.type === filter);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Learning Support</h1>

      {/* Submit Doubt */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Submit a Doubt</h2>

        <label className={styles.label}>Select Course</label>
        <select
          className={styles.input}
          value={doubt.course}
          onChange={(e) => setDoubt({ ...doubt, course: e.target.value })}
        >
          <option value="">Choose a course</option>
          {courses.map((course, i) => (
            <option key={i} value={course}>
              {course}
            </option>
          ))}
        </select>

        <label className={styles.label}>Topic</label>
        <input
          className={styles.input}
          placeholder="e.g., Arrays, Loops"
          value={doubt.topic}
          onChange={(e) => setDoubt({ ...doubt, topic: e.target.value })}
        />

        <label className={styles.label}>Describe your doubt</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={doubt.description}
          onChange={(e) =>
            setDoubt({ ...doubt, description: e.target.value })
          }
        />

        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={handleDoubtSubmit}
        >
          Submit Doubt
        </button>
      </div>

      {/* Backup Class */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Request Backup Class</h2>

        <label className={styles.label}>Select Course</label>
        <select
          className={styles.input}
          value={backup.course}
          onChange={(e) => setBackup({ ...backup, course: e.target.value })}
        >
          <option value="">Choose a course</option>
          {courses.map((course, i) => (
            <option key={i} value={course}>
              {course}
            </option>
          ))}
        </select>

        <label className={styles.label}>Topic</label>
        <input
          className={styles.input}
          placeholder="Topic you need help with"
          value={backup.topic}
          onChange={(e) => setBackup({ ...backup, topic: e.target.value })}
        />

        <label className={styles.label}>Reason for request</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={backup.reason}
          onChange={(e) => setBackup({ ...backup, reason: e.target.value })}
        />

        <button
          className={`${styles.button} ${styles.success}`}
          onClick={handleBackupSubmit}
        >
          Request Backup Class
        </button>
      </div>

      {/* Requests Section */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Your Support Requests</h2>

        {/* Filter Buttons */}
        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterBtn} ${
              filter === "All" ? styles.active : ""
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={`${styles.filterBtn} ${
              filter === "Doubt" ? styles.active : ""
            }`}
            onClick={() => setFilter("Doubt")}
          >
            Doubts
          </button>

          <button
            className={`${styles.filterBtn} ${
              filter === "Backup Class" ? styles.active : ""
            }`}
            onClick={() => setFilter("Backup Class")}
          >
            Backup Classes
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <p className={styles.empty}>No support requests found</p>
        ) : (
          filteredRequests.map((req, index) => (
            <div key={index} className={styles.requestItem}>
              <div>
                <strong>{req.type}</strong> — {req.course}
                <p className={styles.small}>{req.topic}</p>
              </div>
              <span className={styles.badge}>{req.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}