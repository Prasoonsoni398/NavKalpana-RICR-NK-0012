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

  const handleCardClick = (id: number | string) => {
    const quizId = Number(id);

    if (!quizId) {
      alert("Invalid Quiz ID");
      return;
    }

    console.log("Navigating to:", quizId);

    router.push(`/student/quiz-model/${quizId}`);
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (!quizzes.length) {
    return (
      <div className={styles.centered}>
        <p>No quizzes available</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Available Quizzes</h2>

      <div className={styles.grid}>
        {quizzes.map((quiz) => (
          <div key={quiz.id} className={styles.quizCard}>
            <h3 className={styles.quizTitle}>
              {quiz.title}
            </h3>

            <div className={styles.courseInfo}>
              <div className={styles.courseItem}>
                <GraduationCap size={16} />
                {quiz.courseTitle}
              </div>

              <div className={styles.courseItem}>
                <Layers size={16} />
                {quiz.moduleTitle}
              </div>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <Clock size={14} />
                {quiz.durationMinutes} mins
              </div>

              <div className={styles.metaItem}>
                <HelpCircle size={14} />
                {quiz.totalQuestions} Questions
              </div>
            </div>

            <button
              className={styles.btnPrimary}
              onClick={() => {
                handleCardClick(quiz.id);
              }}
            >
              Start Quiz →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}