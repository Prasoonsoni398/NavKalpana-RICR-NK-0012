"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "@/styles/Assignment.module.css";

export default function EvaluationSection({ submission }: any) {

  const total = 10;
  const score = submission?.marks ?? 0;

  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const [offset, setOffset] = useState(circumference);
  const [mounted, setMounted] = useState(false);

  // 🎯 Dynamic Color Based on Score
  const progressColor = useMemo(() => {
    const percentage = (score / total) * 100;

    if (percentage >= 75) return "#22c55e"; // Green
    if (percentage >= 40) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  }, [score]);

  useEffect(() => {
    setMounted(true);

    const progress = (score / total) * circumference;
    setOffset(circumference - progress);
  }, [score, circumference]);

  return (
    <div
      className={`${styles.card} ${styles.evaluationCard}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(20px)",
        transition: "all 0.6s ease"
      }}
    >
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
            stroke={progressColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              transition: "stroke-dashoffset 1s ease, stroke 0.5s ease"
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
          <span className={styles.total}>/ {total}</span>
        </div>
      </div>

      <div className={styles.feedbackCard}>
        <h4>Feedback</h4>
        <p>{submission?.feedback || "No feedback provided."}</p>
      </div>
    </div>
  );
}