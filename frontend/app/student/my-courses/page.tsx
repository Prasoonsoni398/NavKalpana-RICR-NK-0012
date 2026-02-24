"use client";

import CourseCard from "@/components/features/myCourseCards";
import type { CourseResponse } from "@/models/course.model";
import { courseService } from "@/services/user.services";
import { useEffect, useState } from "react";
import styles from "@/styles/CourseCard1.module.css"; // for skeleton styles

const MyCourses = () => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getMyCourses();
      setCourses(res);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${styles.skeletonCard}`}>
        <div className={styles.image}></div>
        <div className={styles.content}>
          <div className={styles.skeletonText} style={{ width: "70%" }} />
          <div className={styles.skeletonText} style={{ width: "90%", marginTop: "8px" }} />
          <div className={styles.skeletonText} style={{ width: "50%", marginTop: "8px" }} />
          <div className={styles.progressContainer}>
            <div className={styles.progressFill} style={{ width: "40%" }} />
          </div>
          <div className={styles.skeletonButton}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "35px 50px",
        background: "#F9FAFB",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          My Enrolled Courses
        </h1>
        <p style={{ color: "#6B7280", textAlign: "center" }}>
          Continue your learning journey
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "25px",
          }}
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p style={{ color: "#6B7280", textAlign: "center" }}>
          You are not enrolled in any courses yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;