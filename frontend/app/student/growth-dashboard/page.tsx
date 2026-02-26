"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Sector, Area, ComposedChart
} from 'recharts';
import { 
  BookOpen, FileText, Award, CheckCircle, Target, 
  ArrowUpRight, TrendingUp, Clock, AlertCircle,
  Zap, Brain, Rocket, Activity, Calendar,
  ChevronRight, Download, RefreshCw, Filter
} from 'lucide-react';
import styles from '@/styles/GrowthAnalytics.module.css';

// Types
interface PerformanceData {
  week: string;
  score: number;
  quizzes: number;
  assignments: number;
  consistency: number;
}

interface ModuleProgress {
  name: string;
  value: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface QuizResult {
  id: string;
  score: number;
  date: string;
}

interface AssignmentResult {
  id: string;
  marks: number;
  submittedOn: string;
  status: 'evaluated' | 'pending';
}

interface StudentData {
  totalModules: number;
  completedModules: number;
  totalAssignments: number;
  submittedAssignments: number;
  onTimeSubmissions: number;
  quizScores: QuizResult[];
  assignmentMarks: AssignmentResult[];
  weeklyPerformance: PerformanceData[];
  moduleProgress: ModuleProgress[];
}

// Mock Data (Replace with actual API calls)
const mockStudentData: StudentData = {
  totalModules: 12,
  completedModules: 8,
  totalAssignments: 15,
  submittedAssignments: 12,
  onTimeSubmissions: 10,
  quizScores: [
    { id: 'q1', score: 85, date: '2024-01-15' },
    { id: 'q2', score: 92, date: '2024-01-22' },
    { id: 'q3', score: 78, date: '2024-01-29' },
    { id: 'q4', score: 95, date: '2024-02-05' },
  ],
  assignmentMarks: [
    { id: 'a1', marks: 88, submittedOn: '2024-01-18', status: 'evaluated' },
    { id: 'a2', marks: 94, submittedOn: '2024-01-25', status: 'evaluated' },
    { id: 'a3', marks: 82, submittedOn: '2024-02-01', status: 'evaluated' },
    { id: 'a4', marks: 0, submittedOn: '2024-02-08', status: 'pending' },
  ],
  weeklyPerformance: [
    { week: 'W1', score: 45, quizzes: 60, assignments: 40, consistency: 50 },
    { week: 'W2', score: 62, quizzes: 75, assignments: 55, consistency: 65 },
    { week: 'W3', score: 78, quizzes: 82, assignments: 70, consistency: 80 },
    { week: 'W4', score: 88, quizzes: 91, assignments: 85, consistency: 92 },
    { week: 'W5', score: 85, quizzes: 88, assignments: 82, consistency: 88 },
    { week: 'W6', score: 92, quizzes: 95, assignments: 90, consistency: 94 },
  ],
  moduleProgress: [
    { name: 'React', value: 90, status: 'completed' },
    { name: 'Node.js', value: 75, status: 'in-progress' },
    { name: 'Python', value: 45, status: 'in-progress' },
    { name: 'UI/UX', value: 80, status: 'completed' },
    { name: 'MongoDB', value: 30, status: 'in-progress' },
    { name: 'GraphQL', value: 15, status: 'not-started' },
  ],
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className={styles.tooltipItem}>
            <span style={{ color: entry.color }}>●</span>
            <span>{entry.name}: </span>
            <strong>{entry.value}%</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Growth Classification Component
const GrowthBadge = ({ ogi }: { ogi: number }) => {
  const getClassification = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: '#10B981', icon: <Rocket size={16} /> };
    if (score >= 70) return { label: 'Improving', color: '#F59E0B', icon: <TrendingUp size={16} /> };
    if (score >= 50) return { label: 'Stable', color: '#3B82F6', icon: <Activity size={16} /> };
    return { label: 'Needs Attention', color: '#EF4444', icon: <AlertCircle size={16} /> };
  };

  const classification = getClassification(ogi);

  return (
    <motion.div 
      className={styles.growthBadge}
      style={{ backgroundColor: `${classification.color}15`, borderColor: classification.color }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <span style={{ color: classification.color }}>{classification.icon}</span>
      <span style={{ color: classification.color }}>{classification.label}</span>
    </motion.div>
  );
};

// Main Dashboard Component
const GrowthAnalyticsDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData>(mockStudentData);
  const [ogi, setOgi] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    moduleCompletion: 0,
    assignmentCompletion: 0,
    avgQuizScore: 0,
    avgAssignmentScore: 0,
    consistency: 0,
    completionRate: 0,
  });
  const [selectedMetric, setSelectedMetric] = useState<string>('ogi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate all metrics
  useEffect(() => {
    calculateMetrics();
  }, [studentData]);

  const calculateMetrics = () => {
    // Module Completion Percentage
    const moduleCompletion = (studentData.completedModules / studentData.totalModules) * 100;

    // Assignment Completion Percentage
    const assignmentCompletion = (studentData.submittedAssignments / studentData.totalAssignments) * 100;

    // Average Quiz Score
    const avgQuizScore = studentData.quizScores.length > 0
      ? studentData.quizScores.reduce((acc, curr) => acc + curr.score, 0) / studentData.quizScores.length
      : 0;

    // Average Assignment Score (only evaluated ones)
    const evaluatedAssignments = studentData.assignmentMarks.filter(a => a.status === 'evaluated');
    const avgAssignmentScore = evaluatedAssignments.length > 0
      ? evaluatedAssignments.reduce((acc, curr) => acc + curr.marks, 0) / evaluatedAssignments.length
      : 0;

    // Submission Consistency
    const consistency = studentData.submittedAssignments > 0
      ? (studentData.onTimeSubmissions / studentData.submittedAssignments) * 100
      : 0;

    // Module Completion Rate (same as completion percentage for now)
    const completionRate = moduleCompletion;

    // Calculate OGI
    const calculatedOgi = 
      (avgQuizScore * 0.40) +
      (avgAssignmentScore * 0.30) +
      (completionRate * 0.20) +
      (consistency * 0.10);

    setMetrics({
      moduleCompletion,
      assignmentCompletion,
      avgQuizScore,
      avgAssignmentScore,
      consistency,
      completionRate,
    });

    setOgi(Math.round(calculatedOgi * 10) / 10);
  };

  // Simulate real-time updates
  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update with new mock data (in real app, this would come from API)
    const updatedData = {
      ...studentData,
      completedModules: Math.min(studentData.completedModules + 1, studentData.totalModules),
      submittedAssignments: Math.min(studentData.submittedAssignments + 1, studentData.totalAssignments),
      onTimeSubmissions: studentData.onTimeSubmissions + 1,
      weeklyPerformance: studentData.weeklyPerformance.map((week, idx) => 
        idx === studentData.weeklyPerformance.length - 1 
          ? { ...week, score: week.score + 2, quizzes: week.quizzes + 1, assignments: week.assignments + 2 }
          : week
      ),
    };
    
    setStudentData(updatedData);
    setIsRefreshing(false);
  };

  // Animation variants - FIXED TYPE ISSUES
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      } 
    }
  };

  const numberVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      } 
    }
  };

  return (
    <motion.div
      className={styles.dashboardWrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header className={styles.header} variants={itemVariants}>
        <div>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Growth Analytics</h1>
            <motion.button 
              className={styles.refreshBtn}
              onClick={refreshData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? styles.spinning : ''} />
              {isRefreshing ? 'Updating...' : 'Sync Data'}
            </motion.button>
          </div>
          <p className={styles.subTitle}>
            Track your academic journey and performance metrics in real-time
          </p>
        </div>
        <div className={styles.headerActions}>
          <motion.button 
            className={styles.downloadBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            Download Report
          </motion.button>
          <motion.button 
            className={styles.filterBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
          </motion.button>
        </div>
      </motion.header>

      {/* OGI Score Section */}
      <motion.div className={styles.ogiSection} variants={itemVariants}>
        <div className={styles.ogiHeader}>
          <h2>Overall Growth Index</h2>
          <GrowthBadge ogi={ogi} />
        </div>
        
        <div className={styles.ogiContent}>
          <div className={styles.ogiLeft}>
            <motion.div 
              className={styles.ogiCircle}
              variants={numberVariants}
            >
              <svg className={styles.progressRing} width="180" height="180">
                <circle
                  className={styles.ringBg}
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <motion.circle
                  className={styles.ringFill}
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: ogi / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 80}`,
                    strokeDashoffset: `${2 * Math.PI * 80 * (1 - ogi / 100)}`,
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={styles.ogiValue}>
                <motion.span 
                  className={styles.ogiNumber}
                  key={ogi}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {ogi}
                </motion.span>
                <span className={styles.ogiPercent}>%</span>
              </div>
            </motion.div>

            <div className={styles.ogiFormula}>
              <h4>OGI Calculation</h4>
              <div className={styles.formulaBreakdown}>
                <div className={styles.formulaItem}>
                  <span>Quiz Average (40%)</span>
                  <span className={styles.formulaValue}>{Math.round(metrics.avgQuizScore)}%</span>
                </div>
                <div className={styles.formulaItem}>
                  <span>Assignment Average (30%)</span>
                  <span className={styles.formulaValue}>{Math.round(metrics.avgAssignmentScore)}%</span>
                </div>
                <div className={styles.formulaItem}>
                  <span>Completion Rate (20%)</span>
                  <span className={styles.formulaValue}>{Math.round(metrics.completionRate)}%</span>
                </div>
                <div className={styles.formulaItem}>
                  <span>Consistency (10%)</span>
                  <span className={styles.formulaValue}>{Math.round(metrics.consistency)}%</span>
                </div>
                <div className={styles.formulaTotal}>
                  <span>Total OGI</span>
                  <span className={styles.formulaValue}>{ogi}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ogiRight}>
            <div className={styles.metricGrid}>
              <motion.div 
                className={styles.metricCard}
                whileHover={{ y: -4 }}
                variants={itemVariants}
              >
                <div className={styles.metricIcon} style={{ backgroundColor: '#FACC1515', color: '#FACC15' }}>
                  <BookOpen size={20} />
                </div>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>Modules</span>
                  <span className={styles.metricValue}>
                    {studentData.completedModules}/{studentData.totalModules}
                  </span>
                  <span className={styles.metricPercent}>
                    {Math.round(metrics.moduleCompletion)}%
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.metricCard}
                whileHover={{ y: -4 }}
                variants={itemVariants}
              >
                <div className={styles.metricIcon} style={{ backgroundColor: '#10B98115', color: '#10B981' }}>
                  <FileText size={20} />
                </div>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>Assignments</span>
                  <span className={styles.metricValue}>
                    {studentData.submittedAssignments}/{studentData.totalAssignments}
                  </span>
                  <span className={styles.metricPercent}>
                    {Math.round(metrics.assignmentCompletion)}%
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.metricCard}
                whileHover={{ y: -4 }}
                variants={itemVariants}
              >
                <div className={styles.metricIcon} style={{ backgroundColor: '#3B82F615', color: '#3B82F6' }}>
                  <Target size={20} />
                </div>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>Quiz Avg</span>
                  <span className={styles.metricValue}>
                    {Math.round(metrics.avgQuizScore)}%
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.metricCard}
                whileHover={{ y: -4 }}
                variants={itemVariants}
              >
                <div className={styles.metricIcon} style={{ backgroundColor: '#F59E0B15', color: '#F59E0B' }}>
                  <Clock size={20} />
                </div>
                <div className={styles.metricInfo}>
                  <span className={styles.metricLabel}>Consistency</span>
                  <span className={styles.metricValue}>
                    {Math.round(metrics.consistency)}%
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Weekly Performance Trend */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <div className={styles.chartHeader}>
            <h3>Weekly Performance Trend</h3>
            <div className={styles.chartLegend}>
              <span><span className={styles.legendDot} style={{ background: '#FACC15' }} /> OGI</span>
              <span><span className={styles.legendDot} style={{ background: '#3B82F6' }} /> Quizzes</span>
              <span><span className={styles.legendDot} style={{ background: '#10B981' }} /> Assignments</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={studentData.weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#FACC15" 
                fill="url(#colorScore)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="quizzes" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="assignments" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              />
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Mastery */}
        <motion.div className={styles.chartCard} variants={itemVariants}>
          <div className={styles.chartHeader}>
            <h3>Skills Mastery</h3>
            <div className={styles.chartLegend}>
              <span><span className={styles.legendDot} style={{ background: '#10B981' }} /> Completed</span>
              <span><span className={styles.legendDot} style={{ background: '#F59E0B' }} /> In Progress</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={studentData.moduleProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={styles.tooltip}>
                        <p className={styles.tooltipLabel}>{payload[0].payload.name}</p>
                        <p className={styles.tooltipItem}>
                          Progress: <strong>{payload[0].value}%</strong>
                        </p>
                        <p className={styles.tooltipItem}>
                          Status: <strong>{payload[0].payload.status}</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 6, 6, 0]}
                barSize={20}
              >
                {studentData.moduleProgress.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.status === 'completed' ? '#10B981' : '#F59E0B'}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance History Table */}
        <motion.div className={styles.tableCard} variants={itemVariants}>
          <div className={styles.chartHeader}>
            <h3>Performance History</h3>
            <button className={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Quiz Score</th>
                  <th>Assignment</th>
                  <th>Consistency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentData.weeklyPerformance.slice().reverse().map((week, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td>{week.week}</td>
                    <td>{week.quizzes}%</td>
                    <td>{week.assignments}%</td>
                    <td>{week.consistency}%</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        week.score >= 85 ? styles.excellent :
                        week.score >= 70 ? styles.improving :
                        week.score >= 50 ? styles.stable :
                        styles.needsAttention
                      }`}>
                        {week.score >= 85 ? 'Excellent' :
                         week.score >= 70 ? 'Improving' :
                         week.score >= 50 ? 'Stable' :
                         'Needs Attention'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div className={styles.insightsSection} variants={itemVariants}>
        <h3>Performance Insights</h3>
        <div className={styles.insightsGrid}>
          <motion.div 
            className={styles.insightCard}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.insightIcon} style={{ backgroundColor: '#FACC1515', color: '#FACC15' }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.insightContent}>
              <h4>Growth Trend</h4>
              <p>Your performance has improved by 43% over the last 4 weeks</p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.insightCard}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.insightIcon} style={{ backgroundColor: '#10B98115', color: '#10B981' }}>
              <Target size={20} />
            </div>
            <div className={styles.insightContent}>
              <h4>Next Milestone</h4>
              <p>Complete 2 more modules to reach "Excellent" status</p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.insightCard}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.insightIcon} style={{ backgroundColor: '#3B82F615', color: '#3B82F6' }}>
              <Brain size={20} />
            </div>
            <div className={styles.insightContent}>
              <h4>Strongest Area</h4>
              <p>Quiz performance is your strongest metric (92% average)</p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.insightCard}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.insightIcon} style={{ backgroundColor: '#F59E0B15', color: '#F59E0B' }}>
              <Activity size={20} />
            </div>
            <div className={styles.insightContent}>
              <h4>Focus Area</h4>
              <p>Assignment completion rate needs improvement</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GrowthAnalyticsDashboard;