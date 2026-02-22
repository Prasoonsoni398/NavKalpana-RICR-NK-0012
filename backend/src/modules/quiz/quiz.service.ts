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

  async findAll(): Promise<Quiz[]> {
    return this.quizRepo.find({
      relations: ['questions', 'questions.options'],
    });
  }

async findOne(id: number): Promise<any> {
  const quiz = await this.quizRepo.findOne({
    where: { id },
    relations: ['questions', 'questions.options'],
  });

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  // Remove isCorrect from options
  const sanitizedQuiz = {
    ...quiz,
    questions: quiz.questions.map((question) => ({
      ...question,
      options: question.options.map(({ isCorrect, ...option }) => option),
    })),
  };

  return sanitizedQuiz;
}

  async startAttempt(dto: StartQuizAttemptDto,studentId:number): Promise<QuizAttempt> {
    const quiz = await this.quizRepo.findOneBy({ id: dto.quizId });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const user = await this.userRepo.findOneBy({ id: studentId ,role:'STUDENT' });
    if (!user) throw new NotFoundException('Student not found');

    return this.attemptRepo.save({
      quizId: dto.quizId,
      studentId: studentId,
      startedAt: new Date(),
    });
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
      const question = quiz.questions.find((q) => q.id === Number(answer.questionId));
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

    await this.attemptRepo.save(attempt);

    return {
      scorePercentage: attempt.scorePercentage,
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