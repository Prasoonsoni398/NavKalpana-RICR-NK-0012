// student/quiz-model/page.tsx

import Link from "next/link";

const quizzes = [
  { id: "1", title: "TypeScript Basics", duration: "5 mins" },
  { id: "2", title: "React Fundamentals", duration: "8 mins" },
  { id: "3", title: "JavaScript Advanced", duration: "10 mins" }
];

export default function QuizListPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Available Quizzes</h2>
      {quizzes.map((quiz) => (
        <div key={quiz.id} style={{ marginBottom: 15 }}>
          <h3>{quiz.title}</h3>
          <p>Duration: {quiz.duration}</p>
          <Link href={`/student/quiz-model/${quiz.id}`}>
            <button>Start Quiz</button>
          </Link>
        </div>
      ))}
    </div>
  );
}