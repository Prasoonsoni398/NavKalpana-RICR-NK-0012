"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { quizService } from "@/services/quiz.services";
import type {
  QuizDetailResponse,
  Question,
  SubmitQuizAttemptResponse,
} from "@/models/quiz.model";
import styles from "@/styles/Quiz.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Answers = Record<number, number[]>; // { [questionId]: [optionId, ...] }
type Phase = "loading" | "lobby" | "quiz" | "result" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const quizId = Number(id);

  // ── State
  const [phase, setPhase] = useState<Phase>("loading");
  const [quiz, setQuiz] = useState<QuizDetailResponse | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<SubmitQuizAttemptResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load quiz
  useEffect(() => {
    if (!quizId) return;
    quizService
      .getById(quizId)
      .then((data) => {
        setQuiz(data);
        setPhase("lobby");
      })
      .catch(() => {
        setError("Failed to load quiz. Please try again.");
        setPhase("error");
      });
  }, [quizId]);

  // ── Timer
  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Handlers
  const handleStart = async () => {
    if (!quiz) return;
    setStarting(true);
    try {
      const attempt = await quizService.startAttempt({ quizId: quiz.id, studentId: 0 });
      setAttemptId(attempt.id);
      setTimeLeft(quiz.durationMinutes * 60);
      setCurrentQ(0);
      setAnswers({});
      setPhase("quiz");
    } catch {
      setError("Could not start the quiz. Please try again.");
      setPhase("error");
    } finally {
      setStarting(false);
    }
  };

  const toggleOption = (question: Question, optionId: number) => {
    setAnswers((prev) => {
      const cur = prev[question.id] || [];
      if (question.questionType === "SINGLE") {
        return { ...prev, [question.id]: [optionId] };
      }
      const has = cur.includes(optionId);
      return {
        ...prev,
        [question.id]: has
          ? cur.filter((x) => x !== optionId)
          : [...cur, optionId],
      };
    });
  };

  const handleSubmit = async () => {
    if (!attemptId || !quiz) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const answersArr = Object.entries(answers).map(([qId, optIds]) => ({
        questionId: Number(qId),
        selectedOptionIds: optIds,
      }));
      const res = await quizService.submitAttempt({ attemptId, answers: answersArr });
      setResult(res);
      setPhase("result");
    } catch {
      setError("Submission failed. Please try again.");
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentQ(0);
    setAttemptId(null);
    setPhase("lobby");
  };

  // ── Derived
  const q = quiz?.questions[currentQ];
  const sel = q ? answers[q.id] || [] : [];
  const answeredCount = Object.keys(answers).length;
  const totalQ = quiz?.questions.length ?? 0;
  const progress = totalQ ? ((currentQ + 1) / totalQ) * 100 : 0;
  const timerDanger = timeLeft > 0 && timeLeft < 60;

  // ─── LOADING ──────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading quiz…</p>
      </div>
    );
  }

  // ─── ERROR ────────────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className={styles.centered}>
        <div className={styles.errorIcon}>✕</div>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.btnPrimary}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── LOBBY ────────────────────────────────────────────────────────────────
  if (phase === "lobby" && quiz) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <span className={styles.badge}>Quiz</span>
          <h1 className={styles.title}>{quiz.title}</h1>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>⏱</span>
              <span>{quiz.durationMinutes} min</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📝</span>
              <span>{quiz.totalQuestions} questions</span>
            </div>
          </div>

          <p className={styles.description}>
            Answer all questions before the timer runs out. Single‑choice
            questions accept one answer; multiple‑choice questions may accept
            more than one.
          </p>

          <button
            className={styles.btnPrimary}
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? "Starting…" : "Begin Quiz →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
  if (phase === "quiz" && quiz && q) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <span className={styles.counter}>
              {currentQ + 1}{" "}
              <span className={styles.counterTotal}>/ {totalQ}</span>
            </span>
            <span
              className={`${styles.timer} ${
                timerDanger ? styles.timerDanger : ""
              }`}
            >
              {formatTime(timeLeft)}
            </span>
            <span className={styles.answered}>
              {answeredCount}/{totalQ} done
            </span>
          </div>

          {/* Progress bar */}
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <p className={styles.qLabel}>Question {currentQ + 1}</p>
          <h2 className={styles.question}>{q.question}</h2>
          <p className={styles.typeHint}>
            {q.questionType === "MULTIPLE"
              ? "✦ Select all that apply"
              : "Select one answer"}
          </p>

          {/* Options */}
          <div className={styles.options}>
            {q.options.map((opt, i) => {
              const selected = sel.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  className={`${styles.option} ${
                    selected ? styles.optionSelected : ""
                  }`}
                  onClick={() => toggleOption(q, opt.id)}
                >
                  <span
                    className={`${styles.optionLetter} ${
                      selected ? styles.optionLetterSelected : ""
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className={styles.optionText}>{opt.optionText}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className={styles.nav}>
            <button
              className={styles.btnGhost}
              onClick={() => setCurrentQ((q) => q - 1)}
              disabled={currentQ === 0}
            >
              ← Prev
            </button>

            {/* Dot indicators */}
            <div className={styles.dots}>
              {quiz.questions.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${
                    i === currentQ ? styles.dotActive : ""
                  } ${answers[quiz.questions[i].id] ? styles.dotDone : ""}`}
                  onClick={() => setCurrentQ(i)}
                  aria-label={`Go to question ${i + 1}`}
                />
              ))}
            </div>

            {currentQ < totalQ - 1 ? (
              <button
                className={styles.btnGhost}
                onClick={() => setCurrentQ((q) => q + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className={styles.btnSubmit}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "…" : "Submit ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const pct = result.scorePercentage;
    const deg = (pct / 100) * 360;
    const grade =
      pct >= 90
        ? "Excellent!"
        : pct >= 70
        ? "Good Job!"
        : pct >= 50
        ? "Passed"
        : "Try Again";
    const gradeClass =
      pct >= 70
        ? styles.gradeGood
        : pct >= 50
        ? styles.gradeOk
        : styles.gradeBad;

    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <span className={`${styles.badge} ${gradeClass}`}>{grade}</span>
          <h1 className={styles.title}>Quiz Complete</h1>

          {/* Score ring */}
          <div
            className={styles.scoreRing}
            style={{
              background: `conic-gradient(var(--color-primary) 0deg, var(--color-primary) ${deg}deg, var(--color-border) ${deg}deg, var(--color-border) 360deg)`,
            }}
          >
            <div className={styles.scoreInner}>
              <span className={styles.scoreNum}>{pct}%</span>
              <span className={styles.scoreLabel}>Score</span>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statCorrect}`}>
              <span className={styles.statVal}>{result.correctCount}</span>
              <span className={styles.statLabel}>Correct</span>
            </div>
            <div className={`${styles.statCard} ${styles.statIncorrect}`}>
              <span className={styles.statVal}>{result.incorrectCount}</span>
              <span className={styles.statLabel}>Incorrect</span>
            </div>
            <div className={`${styles.statCard} ${styles.statTotal}`}>
              <span className={styles.statVal}>{result.totalQuestions}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>

          <button className={styles.btnPrimary} onClick={handleRetake}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}