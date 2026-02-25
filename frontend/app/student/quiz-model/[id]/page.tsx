"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/styles/QuizModal.module.css";
import { quizService } from "@/services/quiz.services";

interface QuizOption {
  id: number;
  optionText: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

interface Quiz {
  title: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  const quizId = Number(params.id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  /* ================= LOAD QUIZ ================= */

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("Loading quiz:", quizId);

        const data = await quizService.getById(quizId);

        console.log("Quiz Data:", data);

        if (!data) {
          alert("Quiz not found");
          router.push("/student/quiz-model");
          return;
        }

        setQuiz(data);
        setTimeLeft(data.durationMinutes * 60);
      } catch (error) {
        console.error("Load error:", error);
        alert("Error loading quiz");
      }
    };

    if (quizId) loadQuiz();
  }, [quizId, router]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => (t ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ================= LOADING ================= */

  if (!quiz || timeLeft === null) {
    return (
      <div className={styles.centered}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  const question = quiz.questions[current];

  const progress =
    ((current + 1) / quiz.questions.length) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>{quiz.title}</div>
          <div className={styles.timer}>{timeLeft}s</div>
        </div>

        {/* Progress */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className={styles.question}>
          {current + 1}. {question.question}
        </div>

        {/* Options */}
        <div className={styles.options}>
          {question.options.map((opt: QuizOption) => (
            <div key={opt.id} className={styles.option}>
              {opt.optionText}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.btn}
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </button>

          <button
            className={styles.btn}
            disabled={current === quiz.questions.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}