"use client";

import styles from '@/styles/CourseDetail.module.css';
import { useParams } from 'next/navigation';
import { COURSES_DATA } from "@/redux/data/data";

export default function CourseDetailPage() {
  const { id } = useParams();

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <span className={styles.badge}>Course ID: {id}</span>
        <h1 className={styles.courseTitle}>Advanced Full Stack Development</h1>
        <p className={styles.instructor}>By Instructor: **Is Controller**</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Left Side: Video & Description */}
        <div className={styles.mainContent}>
          <div className={styles.videoPlaceholder}>
            <p>Video Player Placeholder</p>
          </div>
          <h3>About this course</h3>
          <p>This comprehensive course covers everything from frontend to backend...</p>
        </div>

        {/* Right Side: Pricing & Enrollment */}
        <div className={styles.sidebar}>
          <div className={styles.enrollCard}>
            <h2 className={styles.price}>$99.99</h2>
            <button className={styles.enrollBtn}>Enroll Now</button>
            <ul className={styles.features}>
              <li>Full lifetime access</li>
              <li>Certificate of completion</li>
              <li>24/7 Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}