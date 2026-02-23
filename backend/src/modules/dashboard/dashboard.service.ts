import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';

import { User } from '../../common/entities/user.entity';
import { Course } from '../../common/entities/course.entity';
import { Enrollment } from '../../common/entities/enrollment.entity';
import { CourseProgress } from '../../common/entities/course_progress.entity';
import { Assignment } from '../../common/entities/assignment.entity';
import { AssignmentSubmission } from '../../common/entities/assignment-submission.entity';
import { QuizAttempt } from '../../common/entities/quiz-attempt.entity';
import { ActivityEntityType } from 'src/common/enums/activity-entity-type.enum';
import { SubmissionStatus } from 'src/common/enums/submission-status.enum';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';
import { StudentActivityType } from '../../common/enums/student-activity-type.enum';
import { UserSkill } from '../../common/entities/user-skill.entity';
import { Quiz } from 'src/common/entities/quiz.entity';
import { JobPost } from 'src/common/entities/job-post.entity';
import e from 'express';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Course)
    private coursesRepo: Repository<Course>,

    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,

    @InjectRepository(CourseProgress)
    private courseProgressRepo: Repository<CourseProgress>,

    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(AssignmentSubmission)
    private assignmentSubmissionRepo: Repository<AssignmentSubmission>,

    @InjectRepository(QuizAttempt)
    private quizAttemptRepo: Repository<QuizAttempt>,
    @InjectRepository(UserSkill)
    private userSkillRepo: Repository<UserSkill>,

    @InjectRepository(StudentActivityLog)
    private readonly studentActivityLogRepo: Repository<StudentActivityLog>,
    @InjectRepository(Quiz)
private quizRepo: Repository<Quiz>,
  ) {}

  // ✅ ADMIN DASHBOARD
  async getAdminStats() {
    const totalUsers = await this.usersRepo.count();
    const totalCourses = await this.coursesRepo.count();
    const totalEnrollments = await this.enrollmentRepo.count();

    const totalStudents = await this.usersRepo.count({
      where: { role: 'STUDENT' },
    });

    const totalTeachers = await this.usersRepo.count({
      where: { role: 'TEACHER' },
    });

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
    };
  }

  // ✅ STUDENT DASHBOARD
  async getStudentStats(userId: number) {
    const enrollments = await this.enrollmentRepo.find({
      where: { student: { id: userId } },
      relations: ['course'],
    });

    const courseIds = enrollments.map((e) => e.course.id);
    const enrolledCourses = courseIds.length;

    const completedCourses = await this.courseProgressRepo.count({
      where: {
        student: { id: userId },
        completed: true,
      },
    });

    const totalAssignments =
      courseIds.length === 0
        ? 0
        : await this.assignmentRepo.count({
            where: {
              lesson: {
                module: {
                  course: {
                    id: In(courseIds),
                  },
                },
              },
            },
          });
    const completedAssignments = await this.assignmentSubmissionRepo.count({
      where: {
        student: { id: userId },
        status: SubmissionStatus.EVALUATED,
      },
    });

    const academicScore =
      enrolledCourses === 0
        ? 0
        : Math.round((completedCourses / enrolledCourses) * 100);

    const learningStreak = await this.calculateLearningStreak(userId);
    const weeklyActivity = await this.getWeeklyActivity(userId);
    const earnedSkills = await this.userSkillRepo.find({
    where: { user: { id: userId } },
    relations: ['skill'],
    order: { earnedAt: 'DESC' },
  });

  const skills = earnedSkills.map(us => ({
    id: us.skill.id,
    name: us.skill.name,
    earnedAt: us.earnedAt,
  }));

  const totalSkills = skills;
  const eventCalendar = await this.getCalendarEvents(userId);

    return {
      greeting: this.getGreeting(),
      academicScore,
      assignments: {
        completed: completedAssignments,
        total: totalAssignments,
      },
      learningStreak,
      weeklyActivity,
      totalSkills,
      eventCalendar,
    };
  }

  // ✅ GREETING
  getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  // ✅ LEARNING STREAK (Property-Safe)
  async calculateLearningStreak(userId: number) {
    const logs = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .select('DATE(log.createdAt)', 'date')
      .where('log.student.id = :userId', { userId })
      .andWhere('log.activityType IN (:...types)', {
        types: [
          StudentActivityType.COMPLETED, // lesson opened/completed
          StudentActivityType.SUBMITTED, // assignment submitted
          StudentActivityType.ATTEMPTED, // quiz attempted
        ],
      })
      .groupBy('DATE(log.createdAt)')
      .orderBy('DATE(log.createdAt)', 'DESC')
      .getRawMany();

    if (!logs.length) return 0;

    let streak = 0;
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    for (const row of logs) {
      const activityDate = new Date(row.date);
      activityDate.setUTCHours(0, 0, 0, 0);

      const diffDays =
        (currentDate.getTime() - activityDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return streak;
  }
  async getWeeklyActivity(
    userId: number,
    mode: 'lessons' | 'time' = 'lessons',
  ) {
    const activityTypes = [
      StudentActivityType.OPENED,
      StudentActivityType.COMPLETED,
      StudentActivityType.SUBMITTED,
      StudentActivityType.ATTEMPTED,
    ];

    const logs = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .select('DATE(log.created_at)', 'date')
      .addSelect(
        mode === 'lessons'
          ? 'COUNT(*)'
          : "COALESCE(SUM((log.metadata_json->>'duration')::numeric),0)",
        'value',
      )
      .where('log.student_id = :userId', { userId })
      .andWhere('log.activity_type IN (:...types)', { types: activityTypes })
      .andWhere('log.entity_type = :entityType', {
        entityType: ActivityEntityType.LESSON,
      })
      .andWhere("DATE(log.created_at) >= CURRENT_DATE - INTERVAL '6 days'")
      .groupBy('DATE(log.created_at)')
      .orderBy('DATE(log.created_at)', 'ASC')
      .getRawMany();

    const activityMap = new Map<string, number>();

    logs.forEach((row: any) => {
      const normalizedDate =
        row.date instanceof Date
          ? row.date.toISOString().slice(0, 10)
          : new Date(row.date).toISOString().slice(0, 10);

      activityMap.set(normalizedDate, Number(row.value));
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: { day: string; value: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);

      const dateKey = d.toISOString().slice(0, 10);
      const dayName = days[d.getDay()];

      result.push({
        day: dayName,
        value: activityMap.get(dateKey) ?? 0,
      });
    }

    return result;
  }

  async getCalendarEvents(userId: number) {
  // 1️⃣ Get enrolled course IDs
  const enrollments = await this.enrollmentRepo.find({
    where: { student: { id: userId } },
    relations: ['course'],
  });

  const courseIds = enrollments.map(e => e.course.id);

  if (!courseIds.length) return [];

  // ===============================
  // 2️⃣ ASSIGNMENTS (Only enrolled courses)
  // ===============================

  const assignments = await this.assignmentRepo
    .createQueryBuilder('assignment')
    .leftJoinAndSelect('assignment.lesson', 'lesson')
    .leftJoinAndSelect('lesson.module', 'module')
    .leftJoinAndSelect('module.course', 'course')
    .where('course.id IN (:...courseIds)', { courseIds })
    .andWhere('assignment.deadline IS NOT NULL')
    .getMany();

  const assignmentEvents = assignments.map(a => ({
    id: `assignment-${a.id}`,
    title: a.title,
    type: 'ASSIGNMENT',
    date: a.deadline,
    course: a.lesson.module.course.title,
  }));

  // ===============================
  // 3️⃣ QUIZZES (Using createdAt)
  // ===============================

  const quizzes = await this.quizRepo
    .createQueryBuilder('quiz')
    .leftJoinAndSelect('quiz.lesson', 'lesson')
    .leftJoinAndSelect('lesson.module', 'module')
    .leftJoinAndSelect('module.course', 'course')
    .where('course.id IN (:...courseIds)', { courseIds })
    .getMany();

  const quizEvents = quizzes.map(q => ({
    id: `quiz-${q.id}`,
    title: q.title,
    type: 'QUIZ',
    date: q.createdAt, // ✅ using createdAt now
    course: q.lesson.module.course.title,
  }));

  // ===============================
  // 4️⃣ Merge + Sort by Date
  // ===============================

  const events = [...assignmentEvents, ...quizEvents];

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
  //  TEACHER DASHBOARD
  async getTeacherStats(userId: number) {
    return {
      message: 'Teacher dashboard data loaded',
    };
  }
}
