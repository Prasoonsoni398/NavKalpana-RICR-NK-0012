"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import { studentService } from '@/services/student.services'; // API Service
import toast from 'react-hot-toast';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, TrendingUp, Clock,
  PlayCircle, Calendar, ChevronRight, Layout, Briefcase, Building, Users, ExternalLink,ChevronLeft,
} from 'lucide-react';

export default function StudentDashboard() {

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [student, setStudent] = useState({ name: '', email: '' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  // इवेंट्स के लिए इंटरफेस डिफाइन करें
  interface CalendarEvents {
    [key: string]: string;
  }

  // स्टेट्स (Typed)

  const [events, setEvents] = useState<CalendarEvents>({
    "2026-02-15": "React Exam",
    "2026-02-24": "Project Submission"
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newEventName, setNewEventName] = useState<string>("");

  // लोकल स्टोरेज से डेटा लोड करने के लिए (ताकि रिफ्रेश पर डेटा ना जाए)
  useEffect(() => {
    const savedEvents = localStorage.getItem("dashboard_events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const handleDateClick = (date: number): void => {
    const dateStr: string = `2026-02-${date.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setNewEventName(events[dateStr] || "");
    setShowModal(true);
  };

  const saveEvent = (): void => {
    const updatedEvents: CalendarEvents = { ...events, [selectedDate]: newEventName };

    // अगर इनपुट खाली है तो उस तारीख का इवेंट डिलीट कर दें
    if (!newEventName.trim()) {
      delete updatedEvents[selectedDate];
    }

    setEvents(updatedEvents);
    localStorage.setItem("dashboard_events", JSON.stringify(updatedEvents));
    setShowModal(false);
    toast.success("Calendar Updated!");
  };

  const deleteEvent = (): void => {
    const updatedEvents = { ...events };
    delete updatedEvents[selectedDate]; // उस तारीख का डेटा हटा दो

    setEvents(updatedEvents);
    localStorage.setItem("dashboard_events", JSON.stringify(updatedEvents));
    setShowModal(false);
    setNewEventName("");
    toast.success("Event Deleted");
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const years = [2024, 2025, 2026];

  const monthName = [
    "Jan", "Feb", "Mar", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const year = [2024, 2025, 2026];

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

  const currentMonth = selectedMonth;
  const currentYear = selectedYear;

  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();


  const performanceValue = (selectedMonth * 7 + 45) % 100;

  // --- New Feature States (Heatmap & Stats) ---
  const statsOverview = [
    { label: "Total Courses", value: "08", icon: <Layout size={20} />, color: "#FACC15" },
    { label: "Hours Spent", value: "124h", icon: <Clock size={20} />, color: "#FACC15" },
    { label: "XP Earned", value: "12.5k", icon: <Trophy size={20} />, color: "#FACC15" },
    { label: "Certificates", value: "03", icon: <CheckCircle2 size={20} />, color: "#FACC15" },
  ];

  const heatmapData = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 4))
  );

  // --- API & Effects (Original Logic) ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const data = localStorage.getItem("student_info");
    if (data) {
      setStudent(JSON.parse(data));
    }

    const loadDashboardData = async () => {
      try {
        const data = await studentService.getProfile();
        setProfile(data.student);

        if (data.assignments) {
          setAssignmentCount(data.assignments.length);
          setRecentAssignments(data.assignments.slice(0, 3));
        } else {
          const localData = localStorage.getItem('my_assignments');
          if (localData) {
            const parsed = JSON.parse(localData);
            setAssignmentCount(parsed.length);
            setRecentAssignments(parsed.slice(0, 3));
          }
        }
      } catch (err) {
        console.log("API profile load skipped or failed");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className={styles.loadingState}>Loading Dashboard...</div>;

  // Data mapping
  const displayName = profile?.name || student.name || "Student";
  const displayEmail = profile?.email || student.email || "";

  const leaderboard = [
    { rank: 1, name: displayName, score: 1250 },
    { rank: 2, name: "Rahul Sharma", score: 1120 },
    { rank: 3, name: "Anjali Kumari", score: 980 },
  ];

  const myCourses = [
    { id: 1, title: "Advanced React Patterns", progress: 75, instructor: "Sarah Drasner" },
    { id: 2, title: "Node.js Backend Architecture", progress: 40, instructor: "Maximilian S." },
    { id: 3, title: "UI/UX Fundamentals", progress: 90, instructor: "Gary Simon" },
    { id: 4, title: "Python for Data Science", progress: 60, instructor: "John Doe" },
  ];

  const jobs = [
    { id: 1, role: "Frontend Developer", company: "Google", loc: "Bangalore", type: "Full-time", pay: "₹18-24 LPA" },
    { id: 2, role: "React Intern", company: "Meta", loc: "Remote", type: "Internship", pay: "₹45k/mo" },
    { id: 3, role: "SDE Intern", company: "Amazon", loc: "Hyderabad", type: "Internship", pay: "₹60k/mo" },
    { id: 4, role: "Backend Developer", company: "Microsoft", loc: "Pune", type: "Full-time", pay: "₹25-30 LPA" },
  ];

  const alumniList = [
    { id: 1, name: "Sandeep Maheshwari", role: "SDE-2 @ Microsoft", batch: "Batch 2022", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Priya Sharma", role: "Product Manager @ Amazon", batch: "Batch 2021", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Aman Gupta", role: "Full Stack @ Uber", batch: "Batch 2023", img: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Rahul Verma", role: "Data Scientist @ Tesla", batch: "Batch 2020", img: "https://i.pravatar.cc/150?u=4" }
  ];


  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* ---1. Header Section (Original) --- */}
        <header className={styles.header}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.greetingText}>{greeting}, {displayName}! 👋</h1>
            <p className={styles.subText}>Email: {displayEmail}</p>
            <p className={styles.subText}>You have completed {assignmentCount} assignments so far.</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <input type="text" placeholder="Search lessons..." />
            </div>
            <div className={styles.notifBadge}><Bell size={22} /></div>
            <img
              src={profile?.avatar || `https://ui-avatars.com/api/?name=${displayName}&background=FACC15&color=000`}
              className={styles.profileImg}
              alt="user"
            />
          </div>
        </header>

        {/* --- 2. Continue Learning Hero --- */}
        <div className={styles.continueSection}>
          <div className={styles.continueCard}>
            <div className={styles.continueCardContent}>
              <span className={styles.resumeTag}>RESUME</span>
              <h2>{myCourses?.[0]?.title || "No Active Course"}</h2>
              <p className={styles.instructorText}>By {myCourses?.[0]?.instructor || "Unknown"}</p>

              <button className={styles.viewCourseBtn} onClick={() => console.log("Resuming...")}>
                <PlayCircle size={18} /> Resume Lesson
              </button>
            </div>
            <div className={styles.bgDecoration}>
              <PlayCircle size={150} color="#FACC15" />
            </div>
          </div>
        </div>

        {/* ---3. Bento Grid Stats (Original) --- */}
        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.scoreCard}`}>
            <div className={styles.scoreInfo}>
              <p>Academic Score</p>
              <h2 style={{ color: '#FACC15' }}>{profile?.academicScore || "85.4%"}</h2>
              <span className={styles.trendText}><TrendingUp size={14} /> +2.5%</span>
            </div>
            <Trophy size={60} color="#FACC15" />
          </div>

          <div className={`${styles.bentoCard} ${styles.streakCard}`}>
            <Flame size={32} color="#FB923C" />
            <h3>{profile?.streak || "15 Days"}</h3>
            <p>Learning Streak</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.assignmentCard}`}>
            <Target size={32} color="#FACC15" />
            <h3>{assignmentCount} / 12</h3>
            <p>Assignments Done</p>
          </div>
        </div>

        {/* --- 4. NEW: Activity Heatmap Section --- */}
        <div className={styles.heatmapSection}>
          <div className={styles.heatmapHeader}>
            <h3>Learning Activity</h3>
            <span className={styles.totalStats}>Total: 412 hours this year</span>
          </div>
          <div className={styles.heatmapContainer}>
            {heatmapData.map((week, i) => (
              <div key={i} className={styles.heatmapColumn}>
                {week.map((day, j) => (
                  <div
                    key={j}
                    className={`${styles.heatmapCell} level-${day}`}
                    title={`Activity Level: ${day}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---5. Original Middle Row --- */}
        <div className={styles.middleRow}>
          <div className={styles.activitySection}>
            <h3><Clock size={18} color="#FACC15" /> Recent Submissions</h3>
            <div className={styles.activityList}>
              {recentAssignments.length > 0 ? (
                recentAssignments.map((item, index) => (
                  <div key={item.id || index} className={styles.activityItem}>
                    <div className={styles.activityIcon}><CheckCircle2 size={16} color="#10B981" /></div>
                    <div className={styles.activityInfo}>
                      <strong>{item.displayTitle || item.title || "Assignment"}</strong>
                      <span>Submitted on {item.time || item.createdAt}</span>
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
                  <div className={styles.barFill} style={{ height: `${h}%`, backgroundColor: '#FACC15' }}></div>
                  <span className={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---6. Original Stats Row --- */}
        <div className={styles.statsRow}>
          {statsOverview.map((stat, i) => (
            <div
              key={i}
              className={styles.statMiniCard}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.iconWrapper}>
                {stat.icon}
              </div>
              <div className={styles.content}>
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ---7. Skills & Courses (Original) --- */}
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
                    <div className={styles.progressFill} style={{ width: `${course.progress}%`, backgroundColor: '#FACC15' }}></div>
                  </div>
                </div>
                <button className={styles.viewCourseBtn}>View Course</button>
              </div>
            ))}
          </div>
        </div>

        {/* ---8. Jobs & Internships (Original) ---  */}
        <div className={styles.jobSection}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              <Briefcase size={22} color="#FACC15" /> Jobs & Internships
            </h3>
            <button className={styles.viewAll}>View All →</button>
          </div>

          <div className={styles.jobGrid}>
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className={styles.jobCard}
                style={{ animationDelay: `${index * 0.1}s` }} // Staggered Animation
              >
                <div className={styles.cardHeader}>
                  <Building size={20} color="#94A3B8" />
                  <span className={styles.badge}>{job.type.toUpperCase()}</span>
                </div>

                <h4 className={styles.jobRole}>{job.role}</h4>
                <p className={styles.companyInfo}>{job.company} • {job.loc}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.pay}>{job.pay}</span>
                  <button className={styles.applyBtn}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* ---9. Alumni Network Section --- */}
        <div className={styles.alumniSection}>
          <div className={styles.headerAlumni}>
            <Users size={22} color="#FACC15" />
            <h3>Notable Alumni</h3>
          </div>

          <div className={styles.alumniContainer}>
            {alumniList.map((al, index) => (
              <div
                key={al.id}
                className={styles.alumniCard}
                style={{ animationDelay: `${index * 0.15}s` }} // लहर की तरह कार्ड्स आएंगे
              >
                <img
                  src={al.img}
                  className={styles.avatar}
                  alt={al.name}
                />
                <h4>{al.name}</h4>
                <p className={styles.role}>{al.role}</p>
                <p className={styles.batch}>{al.batch}</p>

                <button className={styles.connectBtn}>
                  Connect <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* ---10. Right Sidebar */}
      <aside className={styles.rightPanel}>

        {/* 10.1. Event Calendar */}
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
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className={styles.weekdayLabel}>{day}</div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptySlot}></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(date => {
              const monthStr = (selectedMonth + 1).toString().padStart(2, '0');
              const dateStr = `${selectedYear}-${monthStr}-${date.toString().padStart(2, '0')}`;
              const hasEvent = !!events[dateStr];
              const isToday = new Date().toDateString() === new Date(selectedYear, selectedMonth, date).toDateString();

              return (
                <div
                  key={date}
                  onClick={() => handleDateClick(date)}
                  className={`${styles.calendarDay} ${isToday ? styles.today : ''}`}
                >
                  {date}
                  {hasEvent && <span className={styles.eventDot}></span>}
                  {hasEvent && (
                    <div className={styles.eventTooltip}><strong>{events[dateStr]}</strong></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.eventModal} onClick={(e) => e.stopPropagation()}>
                <h4 className={styles.modalTitle}>Set Event: {selectedDate}</h4>
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
                  <button onClick={saveEvent} className={styles.saveBtn}>Save</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10.2. Performance Tracker */}
        <div className={styles.monthlyTracker}>
          <div className={styles.trackerHeader}>
            <h3>Performance</h3>
            <div className={styles.filterGroup}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {monthName.map((m, i) => <option key={i} value={i}>{m.substring(0, 3)}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {year.map((y) => <option key={y} value={y}>{y}</option>)}</select>
            </div>
          </div>
          <div className={styles.trackerContent}>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={styles.circle} style={{ stroke: '#FACC15' }} strokeDasharray={`${performanceValue}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className={styles.percentage}>{performanceValue}%</text>
              </svg>
            </div>
            <div className={styles.trackerStats}>
              <div className={styles.statMini}><span>Goals</span><strong>{Math.floor(performanceValue / 6)}/16</strong></div>
              <div className={styles.statMini}><span>Hours</span><strong>{performanceValue + 10}h</strong></div>
            </div>
          </div>
        </div>

        {/* 3. Upcoming Quizzes */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionHeader}><Calendar size={18} color="#FACC15" /> Upcoming Quizzes</h3>
          <div className={styles.quizCard}>
            <div className={styles.dateBadge}>
              <span>FEB</span>
              <strong>24</strong>
            </div>
            <div className={styles.quizInfo}>
              <h4>React Final Quiz</h4>
              <p>10:00 AM • 45 Mins</p>
            </div>
            <ChevronRight size={14} color="#94A3B8" />
          </div>
        </div>

        {/* 4. Skills */}
        <div className={styles.skillsSection}>
          <h3 className={styles.sectionHeader}><Star size={18} color="#FACC15" /> Skills Acquired</h3>
          <div className={styles.pillsContainer}>
            {["React JS", "Node.js", "UI Design", "Next.js", "Python"].map((skill, i) => (
              <div key={i} className={styles.skillPill}><CheckCircle2 size={14} /> {skill}</div>
            ))}
          </div>
        </div>

        {/* 5. Leaderboard */}
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

    </div >
  );
}