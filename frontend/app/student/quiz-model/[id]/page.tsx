"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/styles/QuizModal.module.css";

import { quizService } from "@/services/quiz.services";
import { QuizDetailResponse, Answer } from "@/models/quiz.model";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);

  const [quiz, setQuiz] =
    useState<QuizDetailResponse | null>(null);

  const [attemptId, setAttemptId] =
    useState<number | null>(null);

  const [timeLeft, setTimeLeft] =
    useState<number | null>(null);

  const [answers, setAnswers] =
    useState<Record<number, number[]>>({});

  const [current, setCurrent] = useState(0);

  const [finalScore, setFinalScore] =
    useState<number | null>(null);

  /* ================= LOAD QUIZ ================= */

  useEffect(() => {
    const init = async () => {
      const quizData = await quizService.getById(quizId);
      setQuiz(quizData);

      // ✅ If already attempted → show score
      if (quizData.scorePercentage !== null && quizData.scorePercentage !== undefined) {
        setFinalScore(quizData.scorePercentage);
        return;
      }

      // Otherwise start attempt
      const attempt = await quizService.startAttempt({
        quizId,
        studentId: 1,
      });

      setAttemptId(attempt.id);
      setTimeLeft(quizData.durationMinutes * 60);
    };

    init();
  }, [quizId]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!timeLeft) return;

    if (timeLeft <= 0) submitQuiz();

    const timer = setInterval(() => {
      setTimeLeft((t) => (t ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ================= SELECT ANSWER ================= */

  const selectOption = (
    questionId: number,
    optionId: number
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  /* ================= SUBMIT QUIZ ================= */

  const submitQuiz = async () => {
    if (!attemptId || !quiz) return;

    const formatted: Answer[] =
      Object.entries(answers).map(([qId, opts]) => ({
        questionId: Number(qId),
        selectedOptionIds: opts,
      }));

    const result = await quizService.submitAttempt({
      attemptId,
      answers: formatted,
    });

    setFinalScore(result.scorePercentage);
  };

  /* ================= LOADING ================= */

  if (!quiz)
    return <div className={styles.centered}>Loading...</div>;

  /* ===================================================
     ✅ SCORE VIEW (If Already Submitted OR Just Finished)
  =================================================== */

  if (finalScore !== null) {
    const passed = finalScore >= 50;

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.resultCard}>
            <h2>Quiz Completed 🎉</h2>

            <div
              className={styles.score}
              style={{
                color: passed ? "#22c55e" : "#ef4444",
              }}
            >
              {finalScore}%
            </div>

            <p>
              {passed
                ? "Congratulations! You passed."
                : "You did not pass. Try again."}
            </p>

            <button
              className={`${styles.btn} ${styles.nextBtn}`}
              onClick={() => router.push("/student/quiz-model")}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================================================
     NORMAL QUIZ FLOW
  =================================================== */

  if (timeLeft === null)
    return <div className={styles.centered}>Loading...</div>;

  const question = quiz.questions[current];

  const progress =
    ((current + 1) / quiz.questions.length) * 100;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.title}>{quiz.title}</div>
          <div className={styles.timer}>{timeLeft}s</div>
        </div>

        {/* PROGRESS */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* QUESTION NAV */}
        <div className={styles.questionBar}>
          {quiz.questions.map((q, index) => {
            const answered = answers[q.id];

            return (
              <button
                key={q.id}
                className={`${styles.qBtn}
                  ${current === index ? styles.qActive : ""}
                  ${answered ? styles.qAnswered : ""}
                `}
                onClick={() => setCurrent(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* QUESTION */}
        <div className={styles.question}>
          {current + 1}. {question.question}
        </div>

        {/* OPTIONS */}
        <div className={styles.options}>
          {question.options.map((opt) => (
            <div
              key={opt.id}
              className={`${styles.option}
                ${
                  answers[question.id]?.includes(opt.id)
                    ? styles.optionSelected
                    : ""
                }`}
              onClick={() =>
                selectOption(question.id, opt.id)
              }
            >
              {opt.optionText}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button
            className={`${styles.btn} ${styles.prevBtn}`}
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </button>

          {current === quiz.questions.length - 1 ? (
            <button
              className={`${styles.btn} ${styles.submitBtn}`}
              onClick={submitQuiz}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className={`${styles.btn} ${styles.nextBtn}`}
              disabled={!answers[question.id]}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}