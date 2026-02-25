"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  User,
  CheckCircle,
  CalendarDays,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import styles from "@/styles/CourseCard1.module.css";
import { CourseResponse } from "@/models/course.model";
import { courseDetailsService } from "@/services/course-detail.services";
import toast from "react-hot-toast";

const CourseCard = ({ course }: { course: CourseResponse }) => {
  const router = useRouter();

  // 🔥 Use completionPercentage instead of attendance
  const [progressWidth, setProgressWidth] = useState(
    course.completionPercentage || 0
  );

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(course.isCompleted);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(course.completionPercentage || 0);
    }, 300);
    return () => clearTimeout(timer);
  }, [course.completionPercentage]);

  const markCourseComplete = async () => {
    if (completed || loading) return;

    try {
      setLoading(true);

      await courseDetailsService.markCourseComplete(course.id);

      setProgressWidth(100);
      setCompleted(true);

      toast.success("Course marked as completed 🎉");
    } catch (error) {
      console.error("Failed to complete course:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.card}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -6 }}
      >
        {/* Course Image */}
        <img
          src={course.thumbnailUrl || "/default-course.jpg"}
          alt={course.title}
          className={styles.image}
        />

        <div className={styles.content}>
          {/* Title */}
          <h2 className={styles.title}>{course.title}</h2>

          {/* Description */}
          <p className={styles.description}>{course.description}</p>

          {/* Instructor */}
          <p className={styles.instructor}>
            <User size={16} /> {course.instructorName}
          </p>

          {/* Attendance Info */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CalendarDays size={15} /> {course.totalClasses} Classes
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle size={15} /> {course.presentCount} Present
            </span>
          </div>

          {/* Lesson Info */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={15} /> {course.completedLessons}/
              {course.totalLessons} Lessons Completed
            </span>
          </div>

          {/* Progress Bar (Lesson Completion) */}
          <div className={styles.progressContainer}>
            <div
              className={styles.progressFill}
              style={{
                width: `${progressWidth}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <p className={styles.progressText}>
            {progressWidth}% Course Completion
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Continue Learning */}
            <button
              className={styles.button}
              onClick={() => router.push(`/student/course/${course.id}`)}
            >
              Continue Learning <ArrowRight size={18} />
            </button>

            {/* Mark Complete Button */}
            <button
              className={styles.button}
              onClick={markCourseComplete}
              disabled={loading || completed}
              style={{
                padding: "6px 10px",
                fontSize: "12px",
                borderRadius: "8px",
                width: "fit-content",
                backgroundColor: completed ? "#16A34A" : "#22C55E",
                color: "#fff",
                alignSelf: "flex-start",
                boxShadow: "0 3px 10px rgba(34,197,94,0.3)",
                opacity: loading ? 0.7 : 1,
                cursor: loading || completed ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Completing..."
                : completed
                ? "Completed ✓"
                : "Mark Complete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseCard;