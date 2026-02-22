"use client";

import React, { useEffect, useMemo, useState } from "react";

type QuestionType = "single" | "multiple";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswers: number[];
  type: QuestionType;
}

interface Attempt {
  score: number;
  percentage: number;
  correct: number;
  incorrect: number;
  timeTaken: number;
  date: string;
}

interface Props {
  quizId: string;
}

const QUIZ_DATA: Record<string, { title: string; duration: number; positive: number; negative: number; questions: Question[] }> = {
  "1": {
    title: "TypeScript Basics",
    duration: 300,
    positive: 1,
    negative: 0.25,
    questions: [
      {
        id: 1,
        text: "TypeScript is superset of?",
        options: ["Python", "JavaScript", "Java"],
        correctAnswers: [1],
        type: "single"
      },
      {
        id: 2,
        text: "Which are TS features?",
        options: ["Generics", "Interfaces", "Pointers"],
        correctAnswers: [0, 1],
        type: "multiple"
      }
    ]
  }
};

export default function QuizClient({ quizId }: Props) {
  const quiz = QUIZ_DATA[quizId];
  const total = quiz.questions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`quiz_${quizId}`);
    if (stored) setAttempts(JSON.parse(stored));
  }, [quizId]);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) return handleSubmit();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const toggleAnswer = (qid: number, idx: number) => {
    if (submitted) return;

    const question = quiz.questions.find((q) => q.id === qid)!;

    setAnswers((prev) => {
      const existing = prev[qid] || [];
      let updated: number[];

      if (question.type === "single") {
        updated = [idx];
      } else {
        updated = existing.includes(idx)
          ? existing.filter((i) => i !== idx)
          : [...existing, idx];
      }

      return { ...prev, [qid]: updated };
    });
  };

  const { correct, incorrect, score, percentage } = useMemo(() => {
    let c = 0;
    let i = 0;

    quiz.questions.forEach((q) => {
      const userAns = answers[q.id] || [];
      const correctSorted = [...q.correctAnswers].sort();
      const userSorted = [...userAns].sort();

      const isCorrect =
        correctSorted.length === userSorted.length &&
        correctSorted.every((val, idx) => val === userSorted[idx]);

      if (userAns.length > 0) {
        if (isCorrect) c++;
        else i++;
      }
    });

    const max = total * quiz.positive;
    const finalScore = c * quiz.positive - i * quiz.negative;
    const percent = Math.max(0, (finalScore / max) * 100);

    return { correct: c, incorrect: i, score: finalScore, percentage: percent.toFixed(2) };
  }, [answers]);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);

    const timeTaken = quiz.duration - timeLeft;

    const newAttempt: Attempt = {
      score,
      percentage: Number(percentage),
      correct,
      incorrect,
      timeTaken,
      date: new Date().toLocaleString()
    };

    const updated = [...attempts, newAttempt].sort(
      (a, b) => b.score - a.score || a.timeTaken - b.timeTaken
    );

    setAttempts(updated);
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(updated));
  };

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  const q = quiz.questions[current];

  return (
    <div style={{ padding: 20, display: "flex", gap: 40 }}>
      <div style={{ flex: 3 }}>
        <h2>{quiz.title}</h2>
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Score Preview: {percentage}%</p>

        {!submitted ? (
          <>
            <h3>Q{current + 1}. {q.text}</h3>

            {q.options.map((opt, idx) => (
              <div key={idx}>
                <label>
                  <input
                    type={q.type === "single" ? "radio" : "checkbox"}
                    checked={answers[q.id]?.includes(idx) || false}
                    onChange={() => toggleAnswer(q.id, idx)}
                  />
                  {opt}
                </label>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <button disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Prev</button>
              <button disabled={current === total - 1} onClick={() => setCurrent((c) => c + 1)}>Next</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </>
        ) : (
          <div>
            <h3>Result</h3>
            <p>Score: {score}</p>
            <p>Percentage: {percentage}%</p>
            <p>Correct: {correct}</p>
            <p>Incorrect: {incorrect}</p>
          </div>
        )}
      </div>

      <div>
        <h4>Navigation</h4>
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            style={{
              margin: 5,
              background: answers[quiz.questions[idx].id]
                ? "lightgreen"
                : "lightgray"
            }}
            onClick={() => setCurrent(idx)}
          >
            {idx + 1}
          </button>
        ))}

        <h4 style={{ marginTop: 20 }}>Leaderboard</h4>
        {attempts.map((a, i) => (
          <div key={i}>
            {i + 1}. {a.percentage}% ({a.timeTaken}s)
          </div>
        ))}
      </div>
    </div>
  );
}