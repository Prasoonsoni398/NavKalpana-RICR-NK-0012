"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/CourseCard1.module.css";

type Course = {
  id: number;
  title: string;
  instructor: string;
  image: string;
  progress: number;
  description:string;
};

const CourseCard = ({ course }: { course: Course }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgressWidth(course.progress);
    }, 200);
  }, [course.progress]);

  return (
    <div className={styles.card}>
      <img
        src={course.image}
        alt={course.title}
        className={styles.image}
      />

      <div className={styles.content}>
        <h2 className={styles.title}>
          {course.title}
        </h2>

        <p className={styles.description}>
            {course.description}
        </p>

        <p className={styles.instructor}>
          Instructor: {course.instructor}
        </p>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        
        <p className={styles.progressText}>
          Progress: {course.progress}%
        </p>

        <button className={styles.button}>
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
