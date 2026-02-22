// student/quiz-model/[id]/page.tsx

import QuizClient from "./QuizClient";

interface PageProps {
  params: { id: string };
}

export default function QuizPage({ params }: PageProps) {
  return <QuizClient quizId={params.id} />;
}

