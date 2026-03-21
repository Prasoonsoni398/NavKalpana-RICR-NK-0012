"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import { useRouter } from "next/navigation";
import { dashboardService } from '@/services/dashboard.services';
import { useSelector } from 'react-redux';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, TrendingUp, Clock,
  PlayCircle, Calendar, ChevronRight, Layout, Briefcase, Building, Users, ExternalLink, ChevronLeft, Award, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

// Type Definitions
interface DashboardData {
  name?: string;
  email?: string;
  assignments?: {
    completed: number;
    total: number;
  };
  academicScore?: number;
  learningStreak?: number;
  recentAssignments?: Array<{
    id: number;
    title: string;
    displayTitle?: string;
    time?: string;
    createdAt?: string;
  }>;
  jobPosts?: Array<{
    id: number;
    title: string;
    company?: {
      name: string;
    };
  }>;
  alumni?: Array<{
    id: number;
    name: string;
    position: string;
    batch: string;
  }>;
  topPerformers?: Array<{
    name: string;
    score: number;
  }>;
  weeklyActivity?: number[];
  enrolledCourses?: Array<{
    id: number;
    title: string;
    instructor: string;
    progress: number;
  }>;
  upcomingQuizzes?: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    duration: string;
  }>;
  attendance?: {
    totalClasses: number;
    present: number;
    percentage: number;
  };
}

interface ProfileData {
  student?: {
    name?: string;
    email?: string;
    avatar?: string;
    academicScore?: number;
    performanceTrend?: string;
    streak?: number;
    skills?: string[];
    totalRequiredSkills?: number;
    enrolledCourses?: Array<{
      id: number;
      title: string;
      instructor: string;
      progress: number;
    }>;
  };
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
}

interface Job {
  id: number;
  role: string;
  company: string;
  loc: string;
  type: string;
  pay: string;
}

interface Alumni {
  id: number;
  name: string;
  role: string;
  batch: string;
  img: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
}

interface Event {
  title: string;
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<ProfileData['student'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Record<string, Event>>({});
  const [newEventName, setNewEventName] = useState("");

  const router = useRouter();
  const authState = useSelector((state: any) => state.auth);
  const token = authState?.token;
  const reduxName = authState?.user?.name || authState?.student?.name;
  const localName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const finalBackupName = reduxName || localName || "Student";
  const profileScore = profile?.academicScore;
  const completedAssignments = dashboardData?.assignments?.completed ?? (profileScore ? Math.floor(profileScore / 10) : 0);

  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("");
  const [weeklyStats, setWeeklyStats] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [attendanceData, setAttendanceData] = useState({
    totalClasses: 0,
    present: 0,
    percentage: 0
  });

  // --- 1. Data Fetching ---
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard data
        try {
          const apiResponse = await dashboardService.getStudentDashboard();
          setDashboardData(apiResponse);

          // Set weekly stats if available
          if (apiResponse.weeklyActivity) {
            setWeeklyStats(apiResponse.weeklyActivity);
          }

          // Set attendance if available
          if (apiResponse.attendance) {
            setAttendanceData(apiResponse.attendance);
          }
        } catch (error) {
          console.error("Dashboard API error:", error);
          toast.error("Failed to load dashboard data");
        }

        // Fetch profile and courses in parallel
        const [profileData, coursesData] = await Promise.all([
          dashboardService.getProfile().catch((err) => {
            console.error("Profile fetch error:", err);
            return null;
          }),
          dashboardService.getMyCourses().catch((err) => {
            console.error("Courses fetch error:", err);
            return [];
          })
        ]);

        if (profileData?.student) {
          setProfile(profileData.student);
        }

        // Map courses data to the expected Course interface
        if (coursesData && coursesData.length > 0) {
          const mappedCourses: Course[] = coursesData.map((course: any) => ({
            id: course.id,
            title: course.title,
            instructor: course.instructorName || course.instructor || 'Instructor',
            progress: course.progress || 0
          }));
          setMyCourses(mappedCourses);
        } else if (profileData?.student?.enrolledCourses && profileData.student.enrolledCourses.length > 0) {
          // Fallback to enrolled courses from profile
          const mappedEnrolled: Course[] = profileData.student.enrolledCourses.map((course: any) => ({
            id: course.id,
            title: course.title,
            instructor: course.instructorName || course.instructor || 'Instructor',
            progress: course.progress || 0
          }));
          setMyCourses(mappedEnrolled);
        }

      } catch (err) {
        console.error("Dashboard Sync Error:", err);
        toast.error("Something went wrong while loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const saveEvent = () => {
    if (newEventName.trim() && selectedDate !== null) {
      const dateKey = `${selectedYear}-${selectedMonth + 1}-${selectedDate}`;

      setEvents((prev) => ({
        ...prev,
        [dateKey]: { title: newEventName }
      }));

      // Save to localStorage
      const savedEvents = localStorage.getItem('calendarEvents');
      const allEvents = savedEvents ? JSON.parse(savedEvents) : {};
      allEvents[dateKey] = { title: newEventName };
      localStorage.setItem('calendarEvents', JSON.stringify(allEvents));

      setNewEventName("");
      setShowModal(false);
      toast.success('Event saved successfully!');
    }
  };

  // Load saved events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // --- 2. UI Helpers (API Mapping) ---
  const displayName = dashboardData?.name || profile?.name || finalBackupName;
  const displayEmail = authState?.user?.email || profile?.email || dashboardData?.email || "";

  const totalAssignments = dashboardData?.assignments?.total || 15;
  const assignmentCount = completedAssignments;

  const recentAssignments = dashboardData?.recentAssignments || [];
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const performanceValue = dashboardData?.academicScore || profile?.academicScore || 0;

  // Stats Mapping
  const statsOverview = [
    { label: "Academic Score", value: performanceValue, icon: <Star size={20} />, color: "#FACC15" },
    { label: "Assignments", value: `${assignmentCount}/${totalAssignments}`, icon: <Briefcase size={20} />, color: "#FACC15" },
    { label: "Streak", value: `${profile?.streak || dashboardData?.learningStreak || 0} 🔥`, icon: <Flame size={20} />, color: "#FACC15" },
    { label: "Courses", value: myCourses.length.toString().padStart(2, '0'), icon: <Layout size={20} />, color: "#FACC15" },
  ];

  const attendancePercent = attendanceData.percentage || dashboardData?.academicScore || 85;

  const jobs: Job[] = dashboardData?.jobPosts?.map((job: any) => ({
    id: job.id,
    role: job.title,
    company: job.company?.name || "Unknown Company",
    loc: job.location || "Remote",
    type: job.type || "Full-time",
    pay: job.salary || "Not Disclosed"
  })) || [];

  // Generate heatmap data based on actual activity if available
  const heatmapData = dashboardData?.weeklyActivity
    ? Array.from({ length: 52 }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const activityValue = dashboardData.weeklyActivity?.[(weekIndex + dayIndex) % 7] || 0;
        return Math.floor(activityValue / 25); // Convert 0-100 to 0-3
      })
    )
    : Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 4))
    );

  // --- Calendar Navigation Handlers ---
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const alumniList: Alumni[] = dashboardData?.alumni?.map((al: any) => ({
    id: al.id,
    name: al.name,
    role: al.position || al.role,
    batch: al.batch || al.graduationYear,
    img: al.avatar || `https://i.pravatar.cc/150?u=${al.id}`
  })) || [];

  // Mapping Leaderboard
  const leaderboard: LeaderboardUser[] = dashboardData?.topPerformers?.map((tp: any, index: number) => ({
    rank: index + 1,
    name: tp.name,
    score: tp.score || tp.points || 0
  })) || [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const handleResumeCourse = (courseId: number) => {
    router.push(`/student/course/${courseId}`);
  };

  const handleViewAllCourses = () => {
    router.push('/student/courses');
  };

  const handleViewAllJobs = () => {
    router.push('/student/jobs');
  };

  const handleApplyJob = (jobId: number) => {
    router.push(`/student/jobs/${jobId}/apply`);
    toast.success('Application started!');
  };

  const handleConnectAlumni = (alumniId: number) => {
    router.push(`/student/alumni/${alumniId}`);
    toast.success('Connection request sent!');
  };



  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }


  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* ---1. Header Section --- */}
        <header className={styles.header}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.greetingText}>{greeting}, {displayName}! 👋</h1>
            <p className={styles.subText}>Email: {displayEmail}</p>
            <p className={styles.subText}>
              You have completed {completedAssignments} out of {totalAssignments} assignments so far.
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <input type="text" placeholder="Search lessons, assignments..." />
            </div>
            <button className={styles.notifBadge}>
              <Bell size={22} />
            </button>
            <img
              src={profile?.avatar || `https://ui-avatars.com/api/?name=${displayName}&background=FACC15&color=000&size=128`}
              className={styles.profileImg}
              alt="user"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${displayName}&background=FACC15&color=000`;
              }}
            />
          </div>
        </header>

        {/* ---2. Bento Grid Stats --- */}
        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.scoreCard}`}>
            <div className={styles.scoreInfo}>
              <p className={styles.label}>Academic Score</p>
              <h2 className={styles.yellowText}>
                {performanceValue}%
              </h2>
              <span className={styles.trendText}>
                <TrendingUp size={14} />
                {profile?.performanceTrend || "+5%"} vs last month
              </span>
            </div>
            <Trophy size={60} color="#FACC15" className={styles.iconBg} />
          </div>

          <div className={`${styles.bentoCard} ${styles.streakCard}`}>
            <div className={styles.cardHeader}>
              <Flame size={32} color="#FB923C" fill="#FB923C" />
              <span className={styles.badge}>Keep it up!</span>
            </div>
            <h3>{profile?.streak || dashboardData?.learningStreak || 0} Days</h3>
            <p className={styles.label}>Learning Streak</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.assignmentCard}`}>
            <Target size={32} color="#FACC15" />
            <h3>{assignmentCount} / {totalAssignments}</h3>
            <p className={styles.label}>Assignments Completed</p>
            <div className={styles.miniProgress}>
              <div
                className={styles.miniBar}
                style={{
                  width: `${totalAssignments > 0 ? (assignmentCount / totalAssignments) * 100 : 0}%`
                }}
              />
              <button onClick={() => router.push('/student/assignments')} className={styles.viewBtn}>
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* --- 3. Continue Learning Hero --- */}
        <div className={styles.continueSection}>
          <div className={styles.continueCard}>
            <div className={styles.continueCardContent}>
              <span className={styles.resumeTag}>RESUME</span>
              <h2>{myCourses?.[0]?.title || "No Active Course"}</h2>
              <p className={styles.instructorText}>By {myCourses?.[0]?.instructor || "Instructor"}</p>
              {myCourses?.[0] ? (
                <button
                  className={styles.viewCourseBtn}
                  onClick={() => handleResumeCourse(myCourses[0].id)}
                >
                  <PlayCircle size={18} /> Resume Lesson
                </button>
              ) : (
                <button
                  className={styles.viewCourseBtn}
                  onClick={() => router.push('/student/courses')}
                >
                  <BookOpen size={18} /> Browse Courses
                </button>
              )}
            </div>
            <div className={styles.bgDecoration}>
              <PlayCircle size={150} color="#FACC15" />
            </div>
          </div>
        </div>

        {/* --- 4. Activity Heatmap Section --- */}
        <div className={styles.heatmapSection}>
          <div className={styles.heatmapHeader}>
            <h3>Learning Activity</h3>
            <span className={styles.totalStats}>
              Total: {weeklyStats.reduce((a, b) => a + b, 0)} hours this week
            </span>
          </div>
          <div className={styles.heatmapContainer}>
            {heatmapData.map((week, i) => (
              <div key={i} className={styles.heatmapColumn}>
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={`${styles.heatmapCell} ${styles[`level${day}`]}`}
                    title={`Week ${i + 1}, Day ${j + 1}: Activity Level ${day}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---5. Middle Row --- */}
        <div className={styles.middleRow}>
          <div className={styles.activitySection}>
            <h3><Clock size={18} color="#FACC15" /> Recent Submissions</h3>
            <div className={styles.activityList}>
              {recentAssignments.length > 0 ? (
                recentAssignments.slice(0, 5).map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className={styles.activityItem}
                    onClick={() => router.push(`/student/assignments/${item.id}`)}
                  >
                    <div className={styles.activityIcon}><CheckCircle2 size={16} color="#10B981" /></div>
                    <div className={styles.activityInfo}>
                      <strong>{item.displayTitle || item.title || "Assignment"}</strong>
                      <span>Submitted on {new Date(item.time || item.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No recent submissions. Start working on your assignments!</p>
              )}
            </div>
          </div>

          <div className={styles.activitySection}>
            <h3>Weekly Activity</h3>
            <div className={styles.barChart}>
              {weeklyStats.map((h, i) => (
                <div key={i} className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    title={`${h}%`}
                    style={{
                      height: `${h}%`,
                      backgroundColor: '#FACC15',
                      transition: 'height 0.5s ease-in-out'
                    }}
                  />
                  <span className={styles.barLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---6. Courses Section --- */}
        <div className={styles.coursesSection}>
          <div className={styles.sectionHeader}>
            <h3>My Courses</h3>
            <button className={styles.viewAllBtn} onClick={handleViewAllCourses}>
              View All
            </button>
          </div>
          <div className={styles.coursesGrid}>
            {myCourses.length > 0 ? (
              myCourses.slice(0, 3).map((course) => (
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
                        style={{ width: `${course.progress}%`, backgroundColor: '#FACC15' }}
                      />
                    </div>
                  </div>
                  <button
                    className={styles.viewCourseBtn}
                    onClick={() => handleResumeCourse(course.id)}
                  >
                    Continue Learning
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={48} />
                <p>No courses enrolled yet</p>
                <button
                  className={styles.browseBtn}
                  onClick={() => router.push('/student/courses')}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---7. Jobs & Internships --- */}
        <div className={styles.jobSection}>
          <div className={styles.sectionHeader}>
            <h3>
              <Briefcase size={22} color="#FACC15" /> Jobs & Internships
            </h3>
            <button className={styles.viewAll} onClick={handleViewAllJobs}>
              View All →
            </button>
          </div>

          <div className={styles.jobGrid}>
            {jobs.length > 0 ? (
              jobs.slice(0, 4).map((job: Job, index: number) => (
                <div
                  key={job.id}
                  className={styles.jobCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardHeader}>
                    <Building size={20} color="#94A3B8" />
                    <span className={styles.badge}>{job.type.toUpperCase()}</span>
                  </div>
                  <h4 className={styles.jobRole}>{job.role}</h4>
                  <p className={styles.companyInfo}>{job.company} • {job.loc}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.pay}>{job.pay}</span>
                    <button
                      className={styles.applyBtn}
                      onClick={() => handleApplyJob(job.id)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Briefcase size={48} />
                <p>No job postings available</p>
              </div>
            )}
          </div>
        </div>

        {/* ---8. Alumni Network Section --- */}
        <div className={styles.alumniSection}>
          <div className={styles.sectionHeader}>
            <Users size={22} color="#FACC15" />
            <h3>Notable Alumni</h3>
          </div>

          <div className={styles.alumniContainer}>
            {alumniList.length > 0 ? (
              alumniList.slice(0, 4).map((al: Alumni, index: number) => (
                <div
                  key={al.id}
                  className={styles.alumniCard}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <img
                    src={al.img}
                    className={styles.avatar}
                    alt={al.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${al.name}&background=FACC15&color=000`;
                    }}
                  />
                  <h4>{al.name}</h4>
                  <p className={styles.role}>{al.role}</p>
                  <p className={styles.batch}>{al.batch}</p>
                  <button
                    className={styles.connectBtn}
                    onClick={() => handleConnectAlumni(al.id)}
                  >
                    Connect <ExternalLink size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <Users size={48} />
                <p>No alumni data available</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ---9. Right Sidebar */}
      <aside className={styles.rightPanel}>
        {/* 9.1. Event Calendar */}
        <div className={styles.eventCalendarCard}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.sidebarTitle}>
              <Calendar size={18} className={styles.calendarIcon} /> Event Calendar
            </h3>
            <div className={styles.navActions}>
              <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={16} /></button>
              <span className={styles.currentMonth}>
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`${day}-${index}`} className={styles.weekdayLabel}>{day}</div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptySlot}></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(date => {
              const dateStr = `${selectedYear}-${selectedMonth + 1}-${date}`;
              const hasEvent = !!events[dateStr];
              const isToday = new Date().toDateString() === new Date(selectedYear, selectedMonth, date).toDateString();

              return (
                <div
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setShowModal(true);
                  }}
                  className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${hasEvent ? styles.hasEvent : ''}`}
                >
                  {date}
                  {hasEvent && <span className={styles.eventDot}></span>}
                </div>
              );
            })}
          </div>

          {/* Event Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.eventModal} onClick={(e) => e.stopPropagation()}>
                <h4 className={styles.modalTitle}>
                  {events[`${selectedYear}-${selectedMonth + 1}-${selectedDate}`]
                    ? 'Edit Event'
                    : 'Add Event'}
                </h4>
                <input
                  type="text"
                  autoFocus
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEvent()}
                  placeholder="What's happening?"
                  className={styles.modalInput}
                />
                <div className={styles.modalActions}>
                  <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                  <button onClick={saveEvent} className={styles.saveBtn}>
                    {events[`${selectedYear}-${selectedMonth + 1}-${selectedDate}`] ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 9.2. Performance Tracker */}
        <div className={styles.monthlyTracker}>
          <div className={styles.trackerHeader}>
            <h3>Performance</h3>
            <div className={styles.filterGroup}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {monthNames.map((m, i) => <option key={i} value={i}>{m.substring(0, 3)}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.trackerContent}>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path
                  className={styles.circleBg}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
                <path
                  className={styles.circle}
                  style={{ stroke: '#FACC15' }}
                  strokeDasharray={`${performanceValue}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                // strokeLinecap="round"
                />
                <text x="18" y="20.35" className={styles.percentage} textAnchor="middle" fill="#0F172A">
                  {performanceValue}%
                </text>
              </svg>
            </div>
            <div className={styles.trackerStats}>
              <div className={styles.statMini}>
                <span>Goals</span>
                <strong>{Math.floor(performanceValue / 6)}/16</strong>
              </div>
              <div className={styles.statMini}>
                <span>Hours</span>
                <strong>{performanceValue}h</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 9.3. Upcoming Quizzes */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionHeader}>Upcoming Quizzes</h3>
          {dashboardData?.upcomingQuizzes && dashboardData.upcomingQuizzes.length > 0 ? (
            dashboardData.upcomingQuizzes.map((quiz, index) => (
              <div key={quiz.id || index} className={styles.quizCard}>
                <div className={styles.dateBadge}>
                  <span className={styles.month}>
                    {new Date(quiz.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                  </span>
                  <strong className={styles.day}>{new Date(quiz.date).getDate()}</strong>
                </div>
                <div className={styles.quizInfo}>
                  <h4>{quiz.title}</h4>
                  <div className={styles.quizMeta}>
                    <span>{quiz.time || new Date(quiz.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={styles.separator}>•</span>
                    <span>{quiz.duration || '45 Mins'}</span>
                  </div>
                </div>
                <div className={styles.arrowIcon}>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.quizCard}>
              <div className={styles.dateBadge}>
                <span className={styles.month}>FEB</span>
                <strong className={styles.day}>24</strong>
              </div>
              <div className={styles.quizInfo}>
                <h4>React Final Quiz</h4>
                <div className={styles.quizMeta}>
                  <span>10:00 AM</span>
                  <span className={styles.separator}>•</span>
                  <span>45 Mins</span>
                </div>
              </div>
              <div className={styles.arrowIcon}>
                <ChevronRight size={18} />
              </div>
            </div>
          )}
        </div>

        {/* 9.4. Skills */}
        <div className={styles.skillsSection}>
          <div className={styles.skillsHeaderWrapper}>
            <h3 className={styles.sectionHeader}>Skills Acquired</h3>
            <span className={styles.skillCount}>
              {profile?.skills?.length || 0} / {profile?.totalRequiredSkills || 12}
            </span>
          </div>

          <div className={styles.pillsContainer}>
            {profile?.skills && profile.skills.length > 0 ? (
              <>
                {profile.skills.slice(0, 5).map((skill: string, i: number) => (
                  <div key={i} className={styles.skillPill}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    {skill}
                  </div>
                ))}

                {profile.skills.length > 5 && (
                  <div className={`${styles.skillPill} ${styles.morePill}`}>
                    +{profile.skills.length - 5} More
                  </div>
                )}
              </>
            ) : (
              <p className={styles.noData}>No skills acquired yet. Start learning!</p>
            )}
          </div>

          <div className={styles.skillProgressBar}>
            <div
              className={styles.skillProgressFill}
              style={{
                width: `${profile?.skills?.length ? (profile.skills.length / (profile.totalRequiredSkills || 12)) * 100 : 0}%`,
                backgroundColor: '#FACC15'
              }}
            />
          </div>
        </div>

        {/* 9.5. Attendance */}
        <div className={`${styles.bentoCard} ${styles.attendanceCard}`}>
          <div className={styles.cardHeader}>
            <h4>My Attendance</h4>
          </div>
          <div className={styles.attendanceBody}>
            <div className={styles.circularProgress}>
              <span className={styles.progressValue}>{attendancePercent}%</span>
            </div>
            <div className={styles.attendanceInfo}>
              <p>Total Classes: <strong>{attendanceData.totalClasses || 40}</strong></p>
              <p>Present: <strong>{attendanceData.present || 34}</strong></p>
            </div>
          </div>
          <p className={styles.statusText}>
            {attendancePercent >= 75 ? "✅ Good Standing" : "⚠️ Low Attendance"}
          </p>
        </div>

        {/* 10. Leaderboard */}
        <div className={styles.leaderboardCard}>
          <h3>Top Performers</h3>
          <div className={styles.leaderList}>
            {leaderboard.length > 0 ? (
              leaderboard.map((user: LeaderboardUser) => (
                <div key={user.rank} className={styles.leaderItem}>
                  <span className={styles.rank}>#{user.rank}</span>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userScore}>{user.score} XP</span>
                </div>
              ))
            ) : (
              <div className={styles.leaderItem}>
                <span className={styles.rank}>#1</span>
                <span className={styles.userName}>Sarah Johnson</span>
                <span className={styles.userScore}>2,450 XP</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}