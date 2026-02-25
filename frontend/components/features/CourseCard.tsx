// components/CourseCard.tsx
import styles from "@/styles/CourseCard.module.css";
import Link from "next/link";
import type { CourseResponse } from "@/models/course.model";

export default function CourseCard(data: CourseResponse) {
  return (
    <div className={styles.card}>
      {/* Thumbnail / Image */}
      <div className={styles.imageWrapper}>
        {data.thumbnailUrl ? (
          <img
            src={data.thumbnailUrl}
            alt={data.title}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.courseTitle}>{data.title}</h3>
        <p className={styles.description}>{data.description}</p>
        <p className={styles.instructor}>By {data.instructorName}</p>

        <div className={styles.footer}>
          {/* Remove price if not available */}
          {/* <span className={styles.price}>{price}</span> */}
        </div>
      </div>
    </div>
  );
}
