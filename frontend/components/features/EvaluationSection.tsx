"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/Assignment.module.css";

export default function EvaluationSection({ submission }: any) {
  const total = 10;
  const score = submission.marks;

  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = (score / total) * circumference;
    setOffset(circumference - progress);
  }, [score, circumference]);

  return (
    <div className={`${styles.card} ${styles.evaluationCard}`}>
      <h2>Evaluation</h2>

      <div className={styles.progressWrapper}>
        <svg height={radius * 2} width={radius * 2}>
          
          {/* Background Circle */}
          <circle
            stroke="rgba(255,255,255,0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Progress Circle */}
          <circle
            stroke="#22c55e"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>

        <div className={styles.progressText}>
          <span className={styles.score}>{score}</span>
          <span className={styles.total}>/ {total}</span>
        </div>
      </div>

      <div className={styles.feedbackCard}>
        <h4>Feedback</h4>
        <p>{submission.feedback}</p>
      </div>
    </div>
  );
}