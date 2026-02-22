"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, TrendingUp, Clock
} from 'lucide-react';

export default function StudentDashboard() {
  const [greeting, setGreeting] = useState("");
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  
  // Tracker States
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const studentName = "Dipu Paul";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = [2024, 2025, 2026];

  // Dummy dynamic data for tracker
  const performanceValue = (selectedMonth * 7 + 45) % 100;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const data = localStorage.getItem('my_assignments');
    if (data) {
      const parsedData = JSON.parse(data);
      setAssignmentCount(parsedData.length);
      setRecentAssignments(parsedData.slice(0, 3));
    }
  }, []);

  const leaderboard = [
    { rank: 1, name: "Dipu Paul", score: 1250 },
    { rank: 2, name: "Rahul Sharma", score: 1120 },
    { rank: 3, name: "Anjali Kumari", score: 980 },
  ];

  const myCourses = [
    { id: 1, title: "Advanced React Patterns", progress: 75, instructor: "Sarah Drasner" },
    { id: 2, title: "Node.js Backend Architecture", progress: 40, instructor: "Maximilian S." },
    { id: 3, title: "UI/UX Fundamentals", progress: 90, instructor: "Gary Simon" },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.greetingText}>{greeting}, {studentName}! 👋</h1>
            <p className={styles.subText}>You have completed {assignmentCount} assignments so far.</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <input type="text" placeholder="Search lessons..." />
            </div>
            <div className={styles.notifBadge}><Bell size={22} /></div>
            <img src={`https://ui-avatars.com/api/?name=${studentName}&background=FACC15&color=000`} className={styles.profileImg} alt="user" />
          </div>
        </header>

        {/* Bento Grid Stats */}
        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.scoreCard}`}>
            <div className={styles.scoreInfo}>
              <p>Academic Score</p>
              <h2>85.4%</h2>
              <span className={styles.trendText}><TrendingUp size={14} /> +2.5%</span>
            </div>
            <Trophy size={60} color="#FACC15" />
          </div>

          <div className={`${styles.bentoCard} ${styles.streakCard}`}>
            <Flame size={32} color="#FB923C" />
            <h3>15 Days</h3>
            <p>Learning Streak</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.assignmentCard}`}>
            <Target size={32} color="#FACC15" />
            <h3>{assignmentCount} / 12</h3>
            <p>Assignments Done</p>
          </div>
        </div>

        {/* Middle Row: Recent Submissions & Weekly Activity */}
        <div className={styles.middleRow}>
          <div className={styles.activitySection}>
            <h3><Clock size={18} color="#FACC15" /> Recent Submissions</h3>
            <div className={styles.activityList}>
              {recentAssignments.length > 0 ? (
                recentAssignments.map((item) => (
                  <div key={item.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}><CheckCircle2 size={16} color="#10B981" /></div>
                    <div className={styles.activityInfo}>
                      <strong>{item.displayTitle || "Assignment"}</strong>
                      <span>Submitted on {item.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No recent activity found.</p>
              )}
            </div>
          </div>

          <div className={styles.activitySection}>
            <h3>Weekly Activity</h3>
            <div className={styles.barChart}>
              {[50, 80, 45, 90, 60, 30, 75].map((h, i) => (
                <div key={i} className={styles.barContainer}>
                  <div className={styles.barFill} style={{ height: `${h}%` }}></div>
                  <span className={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className={styles.skillsSection} style={{ marginBottom: '30px' }}>
          <h3><Star size={18} color="#FACC15" /> Skills Acquired</h3>
          <div className={styles.pillsContainer}>
            {["React JS", "Node.js", "UI Design", "Next.js", "Python"].map((skill, i) => (
              <div key={i} className={styles.skillPill}><CheckCircle2 size={14} /> {skill}</div>
            ))}
          </div>
        </div>

        {/* My Courses Section */}
        <div className={styles.coursesSection}>
          <div className={styles.sectionHeader}>
            <h3>My Courses</h3>
            <button className={styles.viewAllBtn}>View All</button>
          </div>
          <div className={styles.coursesGrid}>
            {myCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseInfo}>
                  <h4>{course.title}</h4>
                  <p>{course.instructor}</p>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
                <button className={styles.viewCourseBtn}>View Course</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className={styles.rightPanel}>
        
        {/* 1. Monthly Performance Tracker WITH FILTERS */}
        <div className={styles.monthlyTracker}>
          <div className={styles.trackerHeader}>
            <h3>Performance</h3>
            <div className={styles.filterGroup}>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {months.map((m, i) => <option key={i} value={i}>{m.substring(0, 3)}</option>)}
              </select>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.trackerContent}>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  className={styles.circle} 
                  strokeDasharray={`${performanceValue}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                />
                <text x="18" y="20.35" className={styles.percentage}>{performanceValue}%</text>
              </svg>
            </div>
            <div className={styles.trackerStats}>
              <div className={styles.statMini}>
                <span>Goals</span>
                <strong>{Math.floor(performanceValue/6)}/16</strong>
              </div>
              <div className={styles.statMini}>
                <span>Hours</span>
                <strong>{performanceValue + 10}h</strong>
              </div>
            </div>
          </div>
          <p className={styles.trackerHint}>
            Data for <b>{months[selectedMonth]} {selectedYear}</b>
          </p>
        </div>

        {/* 2. Events Calendar */}
        <div className={styles.calendarContainer}>
          <h3>Events Calendar</h3>
          <div className={styles.calendarGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span key={`day-${index}`} className={styles.dayHead}>{day}</span>
            ))}
            {[...Array(28)].map((_, i) => (
              <div key={`date-${i}`} className={`${styles.calDate} ${i + 1 === 22 || i + 1 === 26 ? styles.calActive : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Performers */}
        <div className={styles.leaderboardCard}>
          <h3>Top Performers</h3>
          <div className={styles.leaderList}>
            {leaderboard.map((user) => (
              <div key={user.rank} className={styles.leaderItem}>
                <span className={styles.rank}>#{user.rank}</span>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userScore}>{user.score} XP</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}