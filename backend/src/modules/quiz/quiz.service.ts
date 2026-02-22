import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from '../../common/entities/quiz.entity';
import { QuizQuestion, QuestionType } from '../../common/entities/quiz-question.entity';
import { QuizOption } from '../../common/entities/quiz-option.entity';
import { QuizAttempt } from '../../common/entities/quiz-attempt.entity';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizAttemptDto } from './dto/submit-quiz-attempt.dto';
import { StartQuizAttemptDto } from './dto/start-quiz-attempt.dto';

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
  ) {}

  async create(dto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepo.create({
      ...dto,
      totalQuestions: dto.questions.length,
    });

    const savedQuiz = await this.quizRepo.save(quiz);

    for (const q of dto.questions) {
      const question = await this.questionRepo.save({
        quizId: savedQuiz.id,
        question: q.question,
        questionType: q.questionType,
        explanation: q.explanation,
      });

      for (const opt of q.options) {
        await this.optionRepo.save({
          questionId: question.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        });
      }
    }

    return savedQuiz;
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizRepo.find({
      relations: ['questions', 'questions.options'],
    });
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async startAttempt(dto: StartQuizAttemptDto): Promise<QuizAttempt> {
    const quiz = await this.quizRepo.findOneBy({ id: dto.quizId });
    if (!quiz) throw new NotFoundException('Quiz not found');

    return this.attemptRepo.save({
      quizId: dto.quizId,
      studentId: dto.studentId,
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

    let correct = 0;
    let incorrect = 0;

    for (const answer of dto.answers) {
      const question = quiz.questions.find(
        (q) => q.id === answer.questionId,
      );
      if (!question) continue;

      if (question.questionType === QuestionType.TEXT) {
        continue;
      }

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

  async remove(id: string) {
    const quiz = await this.quizRepo.findOneBy({ id });
    if (!quiz) throw new NotFoundException('Quiz not found');
    await this.quizRepo.remove(quiz);
    return { message: 'Quiz deleted successfully' };
  }

  async seedDummyQuizzes() {
    const existing = await this.quizRepo.count();
    if (existing > 0) return;

    for (let i = 1; i <= 5; i++) {
      await this.create({
        lessonId: '00000000-0000-0000-0000-000000000000',
        title: `Sample Quiz ${i}`,
        durationMinutes: 10,
        isPublished: true,
        questions: [
          {
            question: 'What is 2 + 2?',
            questionType: QuestionType.SINGLE,
            explanation: 'Basic math',
            options: [
              { optionText: '3', isCorrect: false },
              { optionText: '4', isCorrect: true },
              { optionText: '5', isCorrect: false },
            ],
          },
        ],
      });
    }
  }
}