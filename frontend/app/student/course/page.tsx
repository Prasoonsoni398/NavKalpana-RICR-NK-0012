"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, User, Calendar, CheckCircle, Award } from "lucide-react";
import styles from "@/styles/MyCourses.module.css";
import { dashboardService } from "@/services/dashboard.services";
import toast from "react-hot-toast";

interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail?: string;
  totalLessons: number;
  completedLessons: number;
  attendancePercentage: number;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In real app: const data = await dashboardService.getMyCourses();
        // Mock data for demonstration
        const mockCourses: Course[] = [
          {
            id: 1,
            title: "Advanced React Development",
            instructor: "Dr. Sarah Johnson",
            totalLessons: 24,
            completedLessons: 18,
            attendancePercentage: 85,
          },
          {
            id: 2,
            title: "Node.js Masterclass",
            instructor: "Prof. Michael Chen",
            totalLessons: 30,
            completedLessons: 12,
            attendancePercentage: 60,
          },
        ];
        setCourses(mockCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("Could not load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const markCourseComplete = async (courseId: number) => {
    // In real app: await dashboardService.markCourseComplete(courseId);
    // Simulate update
    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, completedLessons: course.totalLessons, attendancePercentage: 100 }
          : course
      )
    );
    toast.success("Course marked as complete! 🎉");
    // Optionally refresh dashboard stats (could call a global update function)
  };

  const getProgress = (completed: number, total: number) =>
    total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) return <div className={styles.loading}>Loading courses...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Courses</h1>
      <div className={styles.coursesGrid}>
        {courses.map((course) => {
          const progress = getProgress(course.completedLessons, course.totalLessons);
          return (
            <motion.div
              key={course.id}
              className={styles.courseCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.thumbnail}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className={styles.placeholderThumb}>
                    <BookOpen size={40} />
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.instructor}>
                  <User size={16} /> {course.instructor}
                </p>
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className={styles.attendance}>
                  <Calendar size={16} />
                  <span>Attendance: {course.attendancePercentage}%</span>
                </div>
                <div className={styles.actions}>
                  <Link href={`/student/course/${course.id}`} className={styles.viewBtn}>
                    View Course
                  </Link>
                  <button
                    className={styles.completeBtn}
                    onClick={() => markCourseComplete(course.id)}
                    disabled={progress === 100}
                  >
                    {progress === 100 ? (
                      <>
                        <CheckCircle size={16} /> Completed
                      </>
                    ) : (
                      "Mark Course as Complete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}