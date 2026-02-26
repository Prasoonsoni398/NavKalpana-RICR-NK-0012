"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/Quiz.module.css";
import { quizService } from "@/services/quiz.services";
import { Quiz } from "@/models/quiz.model";
import {
  Layers,
  GraduationCap,
  Clock,
  HelpCircle,
} from "lucide-react";

export default function QuizListPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getAll();
        console.log("Quizzes:", data);
        setQuizzes(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/student/quiz-model/${id}`);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className={styles.centered}>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!quizzes.length) {
    return (
      <div className={styles.centered}>
        <p className={styles.loadingText}>
          No quizzes available right now
        </p>
      </div>
    );
  }

  /* ================= PAGE ================= */
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Available Quizzes</h1>

      <div className={styles.grid}>
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={styles.quizCard}
            onClick={() => handleCardClick(quiz.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick(quiz.id);
              }
            }}
          >
            {/* TITLE */}
            <div className={styles.quizTitle}>
              <HelpCircle size={20} /> {quiz.title}
            </div>

            {/* ATTEMPT BADGE */}
            {quiz.isAttempted && (
              <div className={styles.badge}>
                Completed {quiz.scourePercentage ?? 0}%
              </div>
            )}

            <div className={styles.courseInfo}>
              {quiz.courseTitle && (
                <div className={styles.courseItem}>
                  <GraduationCap size={14} />
                  {quiz.courseTitle}
                </div>
              )}

              {quiz.moduleTitle && (
                <div className={styles.courseItem}>
                  <Layers size={14} />
                  {quiz.moduleTitle}
                </div>
              )}
            </div>

            {/* META INFO */}
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <Clock size={14} />
                {quiz.durationMinutes} mins
              </div>

              <div className={styles.metaItem}>
                <GraduationCap size={14} />
                {quiz.totalQuestions} Questions
              </div>
            </div>

            {/* BUTTON */}
            <button
              className={styles.btnPrimary}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(quiz.id);
              }}
            >
              {quiz.isAttempted ? "Retake Quiz →" : "Start Quiz →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}