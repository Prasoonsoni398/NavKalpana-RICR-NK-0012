"use client";
import { useMemo } from "react";
import styles from "@/styles/Assignment.module.css";

export default function EvaluationSection({ submission }: any) {
  const total = 10;
  const score = submission?.marks ?? 0;

  const percentage = (score / total) * 100;

  // 🎯 Dynamic Color
  const progressColor = useMemo(() => {
    if (percentage >= 75) return "#22c55e"; // Green
    if (percentage >= 40) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  }, [percentage]);

  const size = 140;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${styles.card} ${styles.evaluationCard}`}>
      <h2 className={styles.evalTitle}>Evaluation Result</h2>

      <div className={styles.progressWrapper}>
        <svg width={size} height={size}>
          {/* Background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={stroke}
          />

          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)"
            }}
          />
        </svg>

        <div className={styles.progressText}>
          <span
            className={styles.score}
            style={{ color: progressColor }}
          >
            {score}
          </span>
          <span className={styles.total}> / {total}</span>
        </div>
      </div>

      <div className={styles.feedbackCard}>
        <h4>Instructor Feedback</h4>
        <p>{submission?.feedback || "No feedback provided."}</p>
      </div>
    </div>
  );
}