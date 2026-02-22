// --------------------
// QUIZ LIST
// --------------------

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  isPublished: boolean;
}

// --------------------
// QUIZ DETAILS (STUDENT)
// --------------------

export interface QuizDetailResponse {
  id: number;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  questionType: 'SINGLE' | 'MULTIPLE';
  options: Option[];
}

export interface Option {
  id: number;
  optionText: string;
}
// --------------------
// START QUIZ
// --------------------

export interface StartQuizAttemptRequest {
  quizId: number;
  studentId: number;
}

export interface StartQuizAttemptResponse {
  id: number; // attemptId
  quizId: number;
  studentId: number;
  startedAt: string;
}

// --------------------
// SUBMIT QUIZ
// --------------------

export interface SubmitQuizAttemptRequest {
  attemptId: number;
  answers: Answer[];
}

export interface Answer {
  questionId: number;
  selectedOptionIds: number[];
}

// --------------------
// QUIZ RESULT
// --------------------

export interface SubmitQuizAttemptResponse {
  scorePercentage: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
}