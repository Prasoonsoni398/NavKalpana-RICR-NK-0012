import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

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
import { Alumni } from 'src/common/entities/alumni.entity';
import { TopPerformer } from 'src/common/entities/top_performers.entity';
import { ClassSession } from 'src/common/entities/class-session.entity';
import { AttendanceRecord } from 'src/common/entities/attendance-record.entity';
import { AttendanceStatus } from 'src/common/enums/attendance-status.enum';
import { Lesson } from '../../common/entities/lesson.entity';

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
    private studentActivityLogRepo: Repository<StudentActivityLog>,

    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,

    @InjectRepository(JobPost)
    private jobpostRepo: Repository<JobPost>,

    @InjectRepository(Alumni)
    private alumniRepo: Repository<Alumni>,

    @InjectRepository(TopPerformer)
    private topPerformerRepo: Repository<TopPerformer>,

    @InjectRepository(ClassSession)
    private classSessionRepo: Repository<ClassSession>,

    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,

    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>, // ✅ Inject Lesson repo for resume
  ) {}

  // ===================== ADMIN DASHBOARD =====================
  async getAdminStats() {
    const totalUsers = await this.usersRepo.count();
    const totalCourses = await this.coursesRepo.count();
    const totalEnrollments = await this.enrollmentRepo.count();

    const totalStudents = await this.usersRepo.count({ where: { role: 'STUDENT' } });
    const totalTeachers = await this.usersRepo.count({ where: { role: 'TEACHER' } });

    return { totalUsers, totalStudents, totalTeachers, totalCourses, totalEnrollments };
  }

  // ===================== STUDENT DASHBOARD =====================
  async getStudentStats(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // 🔹 Enrollments with full course/module/lesson data
    const enrollments = await this.enrollmentRepo.find({
      where: { student: { id: userId } },
      relations: ['course', 'course.modules', 'course.modules.lessons'],
    });

    const courseIds = enrollments.map((e) => e.course.id);

    // 🔹 Completed lessons
    const lessonProgress = await this.lessonRepo.manager.getRepository('LessonProgress').find({
      where: { student: { id: userId }, completed: true },
      relations: ['lesson'],
    });
    const completedLessonIds = new Set(lessonProgress.map((lp) => lp.lesson.id));

    // 🔹 Lesson-based academic score
    let totalLessons = 0;
    let completedLessons = 0;
    enrollments.forEach((enrollment) => {
      enrollment.course.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          totalLessons++;
          if (completedLessonIds.has(lesson.id)) completedLessons++;
        });
      });
    });
    const academicScore = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // 🔹 Assignments
    const totalAssignments =
      courseIds.length === 0
        ? 0
        : await this.assignmentRepo.count({
            where: { lesson: { module: { course: { id: In(courseIds) } } } },
          });
    const completedAssignments = await this.assignmentSubmissionRepo.count({
      where: { student: { id: userId }, status: SubmissionStatus.EVALUATED },
    });

    // 🔹 Learning streak & weekly activity
    const learningStreak = await this.calculateLearningStreak(userId);
    const weeklyActivity = await this.getWeeklyActivity(userId);

    // 🔹 Skills
    const earnedSkills = await this.userSkillRepo.find({
      where: { user: { id: userId } },
      relations: ['skill'],
      order: { earnedAt: 'DESC' },
    });
    const totalSkills = earnedSkills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      earnedAt: us.earnedAt,
    }));

    // 🔹 Calendar events
    const eventCalendar = await this.getCalendarEvents(userId);

    // 🔹 Job posts, alumni, top performers
    const jobPosts = await this.jobpostRepo.find({
      relations: ['company'],
      order: { createdAt: 'DESC' },
      take: 4,
    });
    const alumni = await this.alumniRepo.find({ order: { id: 'DESC' }, take: 4 });
    const topPerformers = await this.topPerformerRepo.find({ order: { score: 'DESC' }, take: 6 });

    // 🔹 Attendance
    const totalSessions =
      courseIds.length === 0
        ? 0
        : await this.classSessionRepo.count({ where: { course: { id: In(courseIds) } } });
    const presentCount = await this.attendanceRepo.count({
      where: { student: { id: userId }, status: AttendanceStatus.PRESENT },
    });
    const attendancePercentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    // 🔹 Resume lesson
    const resumeLesson = await this.getResumeLesson(userId);

    return {
      greeting: this.getGreeting(),
      studentName: user.name,
      academicScore,
      attendance: { present: presentCount, total: totalSessions, percentage: attendancePercentage },
      assignments: { completed: completedAssignments, total: totalAssignments },
      learningStreak,
      resumeLesson,
      weeklyActivity,
      totalSkills,
      eventCalendar,
      jobPosts,
      alumni,
      topPerformers,
      performanceHeatmap: await this.getPerformanceHeatmap(userId),
    };
  }

  // ===================== GREETING =====================
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  // ===================== LEARNING STREAK =====================
  async calculateLearningStreak(userId: number) {
    const logs = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .select('DATE(log.createdAt)', 'date')
      .where('log.student.id = :userId', { userId })
      .andWhere('log.activityType IN (:...types)', {
        types: [StudentActivityType.COMPLETED, StudentActivityType.SUBMITTED, StudentActivityType.ATTEMPTED],
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
      const diffDays = (currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === streak) streak++;
      else if (diffDays > streak) break;
    }

    return streak;
  }

  async getWeeklyActivity(userId: number, mode: 'lessons' | 'time' = 'lessons') {
    const activityTypes = [StudentActivityType.OPENED, StudentActivityType.COMPLETED, StudentActivityType.SUBMITTED, StudentActivityType.ATTEMPTED];
    const logs = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .select('DATE(log.created_at)', 'date')
      .addSelect(
        mode === 'lessons' ? 'COUNT(*)' : "COALESCE(SUM((log.metadata_json->>'duration')::numeric),0)",
        'value',
      )
      .where('log.student_id = :userId', { userId })
      .andWhere('log.activity_type IN (:...types)', { types: activityTypes })
      .andWhere('log.entity_type = :entityType', { entityType: ActivityEntityType.LESSON })
      .andWhere("DATE(log.created_at) >= CURRENT_DATE - INTERVAL '6 days'")
      .groupBy('DATE(log.created_at)')
      .orderBy('DATE(log.created_at)', 'ASC')
      .getRawMany();

    const activityMap = new Map<string, number>();
    logs.forEach((row: any) => {
      const normalizedDate = new Date(row.date).toISOString().slice(0, 10);
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
      result.push({ day: dayName, value: activityMap.get(dateKey) ?? 0 });
    }
    return result;
  }

  async getCalendarEvents(userId: number) {
    const enrollments = await this.enrollmentRepo.find({ where: { student: { id: userId } }, relations: ['course'] });
    const courseIds = enrollments.map((e) => e.course.id);
    if (!courseIds.length) return [];

    const assignments = await this.assignmentRepo
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.lesson', 'lesson')
      .leftJoinAndSelect('lesson.module', 'module')
      .leftJoinAndSelect('module.course', 'course')
      .where('course.id IN (:...courseIds)', { courseIds })
      .andWhere('assignment.deadline IS NOT NULL')
      .getMany();

    const assignmentEvents = assignments.map((a) => ({
      id: `assignment-${a.id}`,
      title: a.title,
      type: 'ASSIGNMENT',
      date: a.deadline,
      course: a.lesson.module.course.title,
    }));

    const quizzes = await this.quizRepo
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.lesson', 'lesson')
      .leftJoinAndSelect('lesson.module', 'module')
      .leftJoinAndSelect('module.course', 'course')
      .where('course.id IN (:...courseIds)', { courseIds })
      .getMany();

    const quizEvents = quizzes.map((q) => ({
      id: `quiz-${q.id}`,
      title: q.title,
      type: 'QUIZ',
      date: q.createdAt,
      course: q.lesson.module.course.title,
    }));

    return [...assignmentEvents, ...quizEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getPerformanceHeatmap(userId: number) {
    const logs = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .select('DATE(log.created_at)', 'date')
      .addSelect("COALESCE(SUM((log.metadata_json->>'duration')::numeric), 0)", 'totalHours')
      .where('log.student_id = :userId', { userId })
      .andWhere('log.entity_type = :entityType', { entityType: ActivityEntityType.LESSON })
      .groupBy('DATE(log.created_at)')
      .orderBy('DATE(log.created_at)', 'ASC')
      .getRawMany();

    const totalYearHours = logs.reduce((sum, row) => sum + Number(row.totalhours || row.totalHours), 0);
    return { totalYearHours: Math.round(totalYearHours), data: logs.map((row) => ({ date: row.date, hours: Number(row.totalhours || row.totalHours) })) };
  }

  async getResumeLesson(userId: number) {
    const lastOpenedLog = await this.studentActivityLogRepo
      .createQueryBuilder('log')
      .where('log.student_id = :userId', { userId })
      .andWhere('log.activity_type = :type', { type: StudentActivityType.OPENED })
      .andWhere('log.entity_type = :entityType', { entityType: ActivityEntityType.LESSON })
      .orderBy('log.created_at', 'DESC')
      .getOne();

    if (!lastOpenedLog) return null;

    const lesson = await this.lessonRepo.findOne({
      where: { id: lastOpenedLog.entityId },
      relations: ['module', 'module.course'],
    });

    if (!lesson) return null;

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseId: lesson.module.course.id,
      courseTitle: lesson.module.course.title,
    };
  }

  // ===================== TEACHER DASHBOARD =====================
  async getTeacherStats(userId: number) {
    return { message: 'Teacher dashboard data loaded' };
  }
}