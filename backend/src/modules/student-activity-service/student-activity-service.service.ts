import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentActivityLog } from 'src/common/entities/student-activity-log.entity';
import { StudentActivityType } from 'src/common/enums/student-activity-type.enum';
import { ActivityEntityType } from 'src/common/enums/activity-entity-type.enum';
import { User } from 'src/common/entities/user.entity';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class StudentActivityServiceService {
  constructor(
    @InjectRepository(StudentActivityLog)
    private activityLogRepo: Repository<StudentActivityLog>,
  ) {}

  /**
   * Logs a student activity into the database
   */
  async logActivity(
    studentId: number,
    activityType: StudentActivityType,
    entityType: ActivityEntityType,
    entityId: number,
    metadata?: Record<string, any>,
  ): Promise<StudentActivityLog> {
    const activity = this.activityLogRepo.create({
      student: { id: studentId } as User,
      activityType,
      entityType,
      entityId,
      metadataJson: metadata || {},
    });

    return await this.activityLogRepo.save(activity);
  }

  /**
   * Calculate Overall Growth Index (OGI) for a student
   */
  async calculateOgi(studentId: number): Promise<{ ogi: number; classification: string }> {
    const activities = await this.activityLogRepo.find({ where: { student: { id: studentId } } });

    // ✅ Modules/lessons
    const completedModules = activities.filter(
      a => a.activityType === StudentActivityType.COMPLETED &&
           (a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE) &&
           (a.metadataJson?.progressPercentage ?? 0) === 100
    ).length;

    const totalModules = activities.filter(
      a => a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE
    ).length || 1; // avoid division by zero

    const moduleCompletionRate = (completedModules / totalModules) * 100;

    // ✅ Assignments
    const assignments = activities.filter(a => a.entityType === ActivityEntityType.ASSIGNMENT);
    const submittedAssignments = assignments.filter(a => a.activityType === StudentActivityType.SUBMITTED).length;
    const assignmentCompletionRate = (submittedAssignments / Math.max(assignments.length, 1)) * 100;

    const averageAssignmentScore =
      assignments.length > 0
        ? assignments.reduce((sum, a) => sum + (a.metadataJson?.score || 0), 0) / assignments.length
        : 0;

    // ✅ Quizzes
    const quizzes = activities.filter(a => a.entityType === ActivityEntityType.QUIZ);
    const attemptedQuizzes = quizzes.filter(a => a.activityType === StudentActivityType.ATTEMPTED).length;
    const quizCompletionRate = (attemptedQuizzes / Math.max(quizzes.length, 1)) * 100;

    const averageQuizScore =
      quizzes.length > 0
        ? quizzes.reduce((sum, a) => sum + (a.metadataJson?.score || 0), 0) / quizzes.length
        : 0;

    // ✅ OGI Weighted
    const ogi =
      averageQuizScore * 0.4 +
      averageAssignmentScore * 0.3 +
      moduleCompletionRate * 0.2 +
      assignmentCompletionRate * 0.1;

    let classification = 'Needs Attention';
    if (ogi >= 85) classification = 'Excellent';
    else if (ogi >= 70) classification = 'Improving';
    else if (ogi >= 50) classification = 'Stable';

    return { ogi: Math.round(ogi), classification };
  }

  /**
   * Get weekly OGI trend
   */
  async getWeeklyTrend(studentId: number, weeks = 6): Promise<{ weekStart: string; ogi: number }[]> {
    const now = new Date();
    const activities = await this.activityLogRepo.find({ where: { student: { id: studentId } } });

    const weeklyTrend: { weekStart: string; ogi: number }[] = [];

    for (let i = weeks - 1; i >= 0; i--) {
      const start = startOfWeek(subDays(now, i * 7));
      const end = endOfWeek(subDays(now, i * 7));

      const weekActivities = activities.filter(a => a.createdAt >= start && a.createdAt <= end);

      const completedModules = weekActivities.filter(
        a => (a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE) &&
             a.activityType === StudentActivityType.COMPLETED &&
             (a.metadataJson?.progressPercentage ?? 0) === 100
      ).length;

      const assignments = weekActivities.filter(a => a.entityType === ActivityEntityType.ASSIGNMENT);
      const submittedAssignments = assignments.filter(a => a.activityType === StudentActivityType.SUBMITTED);
      const avgAssignment = assignments.length
        ? assignments.reduce((sum, a) => sum + (a.metadataJson?.score || 0), 0) / assignments.length
        : 0;

      const quizzes = weekActivities.filter(a => a.entityType === ActivityEntityType.QUIZ);
      const attemptedQuizzes = quizzes.filter(a => a.activityType === StudentActivityType.ATTEMPTED);
      const avgQuiz = quizzes.length
        ? quizzes.reduce((sum, a) => sum + (a.metadataJson?.score || 0), 0) / quizzes.length
        : 0;

      const moduleRate = completedModules / Math.max(completedModules, 1) * 100;
      const submissionRate = assignments.length ? (submittedAssignments.length / assignments.length) * 100 : 0;

      const weekOgi = avgQuiz * 0.4 + avgAssignment * 0.3 + moduleRate * 0.2 + submissionRate * 0.1;
      weeklyTrend.push({ weekStart: start.toISOString().split('T')[0], ogi: Math.round(weekOgi) });
    }

    return weeklyTrend;
  }

  /**
   * Module completion overview
   */
  async getModuleCompletionOverview(studentId: number) {
    const activities = await this.activityLogRepo.find({ where: { student: { id: studentId } } });

    return activities
      .filter(a => a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE)
      .map(a => ({
        moduleId: a.entityId,
        completed: a.activityType === StudentActivityType.COMPLETED && (a.metadataJson?.progressPercentage ?? 0) === 100 ? 1 : 0,
        date: a.createdAt.toISOString().split('T')[0],
      }));
  }

  /**
   * Weekly performance table
   */
  async getWeeklyPerformanceTable(studentId: number, weeks = 6) {
    const trend = await this.getWeeklyTrend(studentId, weeks);
    const moduleCompletion = await this.getModuleCompletionOverview(studentId);

    return trend.map((w, idx) => ({
      week: `Week ${idx + 1}`,
      ogi: w.ogi,
      completedModules: moduleCompletion.filter(m => m.date >= w.weekStart).length,
    }));
  }

  /**
   * Full analytics for dashboard
   */
  async getFullAnalytics(studentId: number, weeks = 6) {
    const { ogi, classification } = await this.calculateOgi(studentId);
    const weeklyTrend = await this.getWeeklyTrend(studentId, weeks);
    const moduleCompletion = await this.getModuleCompletionOverview(studentId);
    const weeklyTable = await this.getWeeklyPerformanceTable(studentId, weeks);

    const activities = await this.activityLogRepo.find({ where: { student: { id: studentId } } });

    const totalAssignments = activities.filter(a => a.entityType === ActivityEntityType.ASSIGNMENT).length;
    const submittedAssignments = activities.filter(
      a => a.entityType === ActivityEntityType.ASSIGNMENT && a.activityType === StudentActivityType.SUBMITTED
    ).length;

    const totalQuizzes = activities.filter(a => a.entityType === ActivityEntityType.QUIZ).length;
    const attemptedQuizzes = activities.filter(
      a => a.entityType === ActivityEntityType.QUIZ && a.activityType === StudentActivityType.ATTEMPTED
    ).length;

    const averageAssignmentScore =
      totalAssignments > 0
        ? activities.filter(a => a.entityType === ActivityEntityType.ASSIGNMENT && a.metadataJson?.score)
                    .reduce((sum, a) => sum + (a.metadataJson.score || 0), 0) / totalAssignments
        : 0;

    const averageQuizScore =
      totalQuizzes > 0
        ? activities.filter(a => a.entityType === ActivityEntityType.QUIZ && a.metadataJson?.score)
                    .reduce((sum, a) => sum + (a.metadataJson.score || 0), 0) / totalQuizzes
        : 0;

    const completedModules = activities.filter(
      a => (a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE) &&
           a.activityType === StudentActivityType.COMPLETED &&
           (a.metadataJson?.progressPercentage ?? 0) === 100
    ).length;

    const totalModules = Math.max(activities.filter(a => a.entityType === ActivityEntityType.LESSON || a.entityType === ActivityEntityType.MODULE).length, 1);

    return {
      data: {
        ogi,
        classification,
        weeklyTrend,
        moduleCompletion,
        weeklyTable,
        metrics: {
          moduleCompletionPercentage: Math.round((completedModules / totalModules) * 100),
          assignmentCompletionPercentage: totalAssignments ? Math.round((submittedAssignments / totalAssignments) * 100) : 0,
          quizCompletionPercentage: totalQuizzes ? Math.round((attemptedQuizzes / totalQuizzes) * 100) : 0,
          averageAssignmentScore: Math.round(averageAssignmentScore),
          averageQuizScore: Math.round(averageQuizScore),
        },
      },
    };
  }
}