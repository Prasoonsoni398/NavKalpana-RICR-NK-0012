import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from '../../common/entities/quiz.entity';
import { QuizQuestion } from '../../common/entities/quiz-question.entity';
import { QuizOption } from '../../common/entities/quiz-option.entity';
import { QuizAttempt } from '../../common/entities/quiz-attempt.entity';
import { QuestionType } from '../../common/enums/question_type_enum';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import { StartQuizAttemptDto } from './dto/start-quiz-attempt.dto';
import { User } from 'src/common/entities/user.entity';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';
import { StudentActivityType } from '../../common/enums/student-activity-type.enum';
import { ActivityEntityType } from '../../common/enums/activity-entity-type.enum';
import { Enrollment } from 'src/common/entities/enrollment.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,

    @InjectRepository(QuizQuestion)
    private readonly questionRepo: Repository<QuizQuestion>,

    @InjectRepository(QuizOption)
    private readonly optionRepo: Repository<QuizOption>,

    @InjectRepository(QuizAttempt)
    private readonly attemptRepo: Repository<QuizAttempt>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(StudentActivityLog)
    private readonly studentActivityLogRepo: Repository<StudentActivityLog>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  // // Create Quiz
  // async create(dto: CreateQuizDto): Promise<Quiz> {
  //   const quiz = this.quizRepo.create({
  //     lessonId: dto.lessonId,
  //     title: dto.title,
  //     durationMinutes: dto.durationMinutes,
  //     isPublished: dto.isPublished,
  //     totalQuestions: dto.questions.length,
  //   });

  //   const savedQuiz = await this.quizRepo.save(quiz);

  //   for (const q of dto.questions) {
  //     const question = await this.questionRepo.save({
  //       quizId: savedQuiz.id,
  //       question: q.question,
  //       questionType: q.questionType,
  //       explanation: q.explanation,
  //     });

  //     for (const opt of q.options) {
  //       await this.optionRepo.save({
  //         questionId: question.id,
  //         optionText: opt.optionText,
  //         isCorrect: opt.isCorrect,
  //       });
  //     }
  //   }

  //   return savedQuiz;
  // }

async findAll(studentId: number) {

  const quizzes = await this.quizRepo.find({
    relations: [
      'lesson',
      'lesson.module',
      'lesson.module.course',
      'questions',
      'questions.options',
    ],
  });

  const result = await Promise.all(quizzes.map(async (quiz) => {

    const courseTitle =
      quiz.lesson?.module?.course?.title ?? null;

      const quizAttempt = await this.attemptRepo.findOne({
        where: {
          quizId: quiz.id,
          studentId,
        },
      });

    return {
      id: quiz.id,
      title: quiz.title,
      
      isAttempted: quizAttempt ? true : false,
      scourePercentage: quizAttempt?.scorePercentage ?? null,
      durationMinutes: quiz.durationMinutes,
      totalQuestions: quiz.totalQuestions,
      
      lessonId: quiz.lesson?.id ?? null,
      moduleTitle: quiz.lesson?.module?.title ?? null,
      courseTitle: courseTitle,
    };
  }));

  return result
}
async findOne(
  id: number,
  studentId: number,
): Promise<any> {
  const quiz = await this.quizRepo.findOne({
    where: { id },
    relations: [
      'questions',
      'questions.options',
      'lesson',
      'lesson.module',
      'lesson.module.course',
    ],
  });

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  // 🔥 Get student attempt
  const attempt = await this.attemptRepo.findOne({
    where: {
      quizId: id,
      studentId,
    },
  });

  const isSubmitted = !!attempt?.submittedAt;

  return {
    id: quiz.id,
    title: quiz.title,
    durationMinutes: quiz.durationMinutes,
    totalQuestions: quiz.totalQuestions,

    lessonId: quiz.lesson?.id ?? null,
    moduleTitle: quiz.lesson?.module?.title ?? null,
    courseTitle: quiz.lesson?.module?.course?.title ?? null,

    //  Attempt Info
    isAttempted: isSubmitted,
    scorePercentage: isSubmitted
      ? attempt?.scorePercentage ?? 0
      : null,

    //  Questions (sanitized)
    questions: quiz.questions.map((question) => ({
      id: question.id,
      quizId: question.quizId,
      question: question.question,
      questionType: question.questionType,
      explanation: question.explanation,
      options: question.options.map(
        ({ isCorrect, ...option }) => option
      ),
    })),
  };
}

async startAttempt(dto: StartQuizAttemptDto, studentId: number): Promise<QuizAttempt> {
  const quiz = await this.quizRepo.findOneBy({ id: dto.quizId });
  if (!quiz) throw new NotFoundException('Quiz not found');

  const user = await this.userRepo.findOneBy({ id: studentId, role: 'STUDENT' });
  if (!user) throw new NotFoundException('Student not found');

  const attempt = await this.attemptRepo.save({
    quizId: dto.quizId,
    studentId: studentId,
    startedAt: new Date(),
  });

  // ✅ LOG QUIZ START
  await this.studentActivityLogRepo.save({
    student: { id: studentId },
    activityType: StudentActivityType.ATTEMPTED,
    entityType: ActivityEntityType.QUIZ,
    entityId: dto.quizId,
    metadataJson: {
      attemptId: attempt.id,
    },
  });

  return attempt;
}

 async submitAttempt(dto: SubmitQuizAttemptDto) {
  const attempt = await this.attemptRepo.findOneBy({
    id: dto.attemptId,
  });

  if (!attempt) throw new NotFoundException('Attempt not found');

  const quiz = await this.quizRepo.findOne({
    where: { id: attempt.quizId },
    relations: ['questions', 'questions.options'],
  });

  if (!quiz) throw new NotFoundException('Quiz not found');

  let correct = 0;
  let incorrect = 0;

  for (const answer of dto.answers) {
    const question = quiz.questions.find(
      (q) => q.id === Number(answer.questionId),
    );
    if (!question) continue;

    const correctOptions = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id)
      .sort();

    const selected = (answer.selectedOptionIds || []).sort();

    const isCorrect =
      JSON.stringify(correctOptions) === JSON.stringify(selected);

    if (isCorrect) correct++;
    else incorrect++;
  }

  const total = quiz.totalQuestions;
  const score = (correct / total) * 100;

  attempt.correctCount = correct;
  attempt.incorrectCount = incorrect;
  attempt.scorePercentage = Number(score.toFixed(2));
  attempt.submittedAt = new Date();

  const savedAttempt = await this.attemptRepo.save(attempt);

  // ✅ LOG QUIZ SUBMISSION
  await this.studentActivityLogRepo.save({
    student: { id: attempt.studentId },
    activityType: StudentActivityType.SUBMITTED,
    entityType: ActivityEntityType.QUIZ,
    entityId: attempt.quizId,
    metadataJson: {
      attemptId: savedAttempt.id,
      score: savedAttempt.scorePercentage,
      correctCount: correct,
      incorrectCount: incorrect,
      totalQuestions: total,
    },
  });

  return {
    scorePercentage: savedAttempt.scorePercentage,
    correctCount: correct,
    incorrectCount: incorrect,
    totalQuestions: total,
  };
}

  async remove(id: number) {
    const quiz = await this.quizRepo.findOneBy({ id });
    if (!quiz) throw new NotFoundException('Quiz not found');

    await this.quizRepo.remove(quiz);
    return { message: 'Quiz deleted successfully' };
  }


}