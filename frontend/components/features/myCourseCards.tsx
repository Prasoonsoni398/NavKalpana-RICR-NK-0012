"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "@/styles/CourseCard1.module.css";
import { CourseResponse } from "@/models/course.model";



const CourseCard = ({ course }: { course: CourseResponse }) => {

    const router = useRouter();

    const [progressWidth, setProgressWidth] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setProgressWidth(10);
        }, 200);
    }, [10]);

    return (

        <div className={styles.card}>
            <motion.div
                className={styles.card}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut"
                }}
                whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.6 }
                }}
            >

                <img
                    src={course.thumbnailUrl || "/default-course.jpg"}
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
                        Instructor: {course.instructorName}
                    </p>

                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressWidth}%` }}
                        ></div>
                    </div>

                    <p className={styles.progressText}>
                        Progress: {10}%
                    </p>

                    <button
                        className={styles.button}
                        onClick={() => router.push(`/student/my-courses/course/${course.id}`)}
                    >
                        Continue Learning
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseCard;
