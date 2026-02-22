"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, Calendar as CalIcon, TrendingUp
} from 'lucide-react';

export default function StudentDashboard() {
  const [greeting, setGreeting] = useState("");
  const studentName = "Dipu Paul";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const stats = {
    score: 85.4,
    streak: 15,
    assignments: { done: 8, total: 12 },
    skills: ["React JS", "Node.js", "UI Design", "Python", "SQL"]
  };

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
        <header className={styles.header}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.greetingText}>{greeting}, {studentName}! 👋</h1>
            <p className={styles.subText}>Ready to master new skills today?</p>
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

        {/* Stats Bento Grid */}
        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.scoreCard}`}>
            <div className={styles.scoreInfo}>
              <p>Academic Score</p>
              <h2>{stats.score}%</h2>
              <span className={styles.trendText}><TrendingUp size={14} /> +2.5%</span>
            </div>
            <Trophy size={60} color="#FACC15" />
          </div>

          <div className={`${styles.bentoCard} ${styles.streakCard}`}>
            <Flame size={32} color="#FB923C" />
            <h3>{stats.streak} Days</h3>
            <p>Learning Streak</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.assignmentCard}`}>
            <Target size={32} color="#60A5FA" />
            <h3>{stats.assignments.done}/{stats.assignments.total}</h3>
            <p>Assignments</p>
          </div>
        </div>

        {/* Activity & Skills */}
        <div className={styles.middleRow}>
          <div className={styles.skillsSection}>
            <h3><Star size={18} color="#FACC15" /> Skills Acquired</h3>
            <div className={styles.pillsContainer}>
              {stats.skills.map((skill, i) => (
                <div key={i} className={styles.skillPill}>
                  <CheckCircle2 size={14} /> {skill}
                </div>
              ))}
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
            <div 
              className={styles.progressFill} 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* New View Button */}
        <button className={styles.viewCourseBtn}>
          View Course
        </button>
      </div>
    ))}
  </div>
</div>

        {/* Leaderboard */}
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
      </main>

      <aside className={styles.rightPanel}>
        <div className={styles.calendarContainer}>
          <h3>Events Calendar</h3>
          <div className={styles.calendarGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span
                key={`day-${index}`}
                className={styles.dayHead}
                style={{ fontSize: '10px' }}
              >
                {day}
              </span>
            ))}

            {[...Array(28)].map((_, i) => (
              <div
                key={`date-${i}`}
                className={`${styles.calDate} ${i + 1 === 22 || i + 1 === 26 ? styles.calActive : ''}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}