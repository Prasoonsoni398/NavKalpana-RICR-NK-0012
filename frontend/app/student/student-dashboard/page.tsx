"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import { studentService } from '@/services/student.services';
import { courseService } from '@/services/user.services';
import toast from 'react-hot-toast';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, TrendingUp, Clock,
  PlayCircle, Calendar, ChevronRight, Layout, Briefcase, Building, Users, ExternalLink, ChevronLeft,
  FileText
} from 'lucide-react';

export default function StudentDashboard() {
  // --- 1. States ---
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [student, setStudent] = useState({ name: '', email: '' });

  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);

  // 🆕 Quiz States
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<any>({});
  const [showModal, setShowModal] = useState<boolean>(false); // ✅ Added
const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [newEventName, setNewEventName] = useState<string>(""); // ✅ Added

  // --- 2. Initial Data Fetching ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const localInfo = localStorage.getItem("student_info");
    if (localInfo) setStudent(JSON.parse(localInfo));

    const savedEvents = localStorage.getItem("dashboard_events");
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    const loadAllData = async () => {
      try {
        setLoading(true);
        const [profileData, coursesData, assignmentsData, quizzesData] = await Promise.all([
          studentService.getProfile().catch(() => null),
          courseService.getMyCourses().catch(() => []),
          courseService.getAllAssignments().catch(() => []),
          courseService.getAllQuizzes().catch(() => [])
        ]);

        if (profileData) setProfile(profileData.student);
        setMyCourses(coursesData || []);

        const assignments = assignmentsData || [];
        setAssignmentCount(assignments.length);
        setRecentAssignments(assignments.slice(0, 3));

        setQuizzes(quizzesData || []);

      } catch (err) {
        console.error("Sync Error:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // --- 3. Handlers ---
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

  // 🆕 Quiz Start Handler
  const handleStartQuiz = async (quizId: string) => {
    try {
      await courseService.startQuiz(quizId);
      toast.success("Quiz started! Good luck 🍀");
    } catch (error) {
      toast.error("Could not start quiz");
    }
  };

  // --- 4. Logic & Helper Data ---
  if (loading) return <div className={styles.loadingState}>Loading Dashboard...</div>;

  const displayName = profile?.name || student.name || "Student";
  const displayEmail = profile?.email || student.email || "";

  const performanceValue = 75;

  const leaderboard = [
    { rank: 1, name: displayName, score: 1250 },
    { rank: 2, name: "Arjun Mehta", score: 1120 }, // आपकी अपनी रैंक
    { rank: 3, name: "Sneha Kapoor", score: 980 },
    { rank: 4, name: "Vikram Rathore", score: 850 },
  ];



  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

  const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();


// 2. यह रहा वो फंक्शन जो गायब है:
const handleDateClick = (date: number) => {
  console.log("Selected Date:", date);
  setSelectedDate(date);
  // यहाँ आप चाहें तो उस डेट के असाइनमेंट फ़िल्टर करने का लॉजिक भी डाल सकते हैं
};

  const statsOverview = [
    { label: "Total Courses", value: myCourses.length.toString().padStart(2, '0'), icon: <Layout size={20} />, color: "#FACC15" },
    { label: "Assignments", value: assignmentCount.toString().padStart(2, '0'), icon: <Briefcase size={20} />, color: "#FACC15" },
    { label: "Available Quizzes", value: quizzes.length.toString().padStart(2, '0'), icon: <FileText size={20} />, color: "#FACC15" }, // 🆕 Quiz Stat
    { label: "XP Earned", value: "12.5k", icon: <Trophy size={20} />, color: "#FACC15" },
  ];

  const totalAssignments = 12;

  const heatmapData = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 4))
  );

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


// यही वो फंक्शन है जो एरर दे रहा है
const saveEvent = () => {
  if (!newEventName.trim()) return; // अगर नाम खाली है तो कुछ मत करो

  const newEvent = {
    id: Date.now(),
    name: newEventName,
    date: selectedDate, // जो डेट सेलेक्ट की गई है
  };

  setEvents([...events, newEvent]);
  setNewEventName(""); 
};


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

        {/* ---2. Bento Grid Stats (Original) --- */}
        <div className={styles.bentoGrid}>
          <div className={`${styles.bentoCard} ${styles.scoreCard}`}>
            <div className={styles.scoreInfo}>
              <p className={styles.label}>Academic Score</p>
              <h2 className={styles.yellowText}>
                {profile?.academicScore ? `${profile.academicScore}%` : "85.4%"}
              </h2>
              <span className={styles.trendText}>
                <TrendingUp size={14} /> +2.5% vs last month
              </span>
            </div>
            <Trophy size={60} color="#FACC15" className={styles.iconBg} />
          </div>

          <div className={`${styles.bentoCard} ${styles.streakCard}`}>
            <div className={styles.cardHeader}>
              <Flame size={32} color="#FB923C" fill="#FB923C" />
              <span className={styles.badge}>Keep it up!</span>
            </div>
            <h3>{profile?.streak || "15"} Days</h3>
            <p className={styles.label}>Learning Streak</p>
          </div>

          <div className={`${styles.bentoCard} ${styles.assignmentCard}`}>
            <Target size={32} color="#FACC15" />
            <h3>{assignmentCount} / {totalAssignments || 12}</h3>
            <p className={styles.label}>Assignments Completed</p>
            <div className={styles.miniProgress}>
              <div
                className={styles.miniBar}
                style={{ width: `${(assignmentCount / (totalAssignments || 12)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- 3. Continue Learning Hero --- */}
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
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`${day}-${index}`} className={styles.weekdayLabel}>{day}</div>
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
                {monthNames.map((m, i) => <option key={i} value={i}>{m.substring(0, 3)}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
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

        {/* 10.3. Upcoming Quizzes */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionHeader}>
            Upcoming Quizzes
          </h3>

          <div className={styles.quizCard}>
            <div className={styles.dateBadge}>
              <span className={styles.month}>FEB</span>
              <strong className={styles.day}>24</strong>
              {/* Today indicator */}
              <div className={styles.todayDot}></div>
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
        </div>

        {/* 10.4. Skills */}
        <div className={styles.skillsSection}>
          <div className={styles.skillsHeaderWrapper}>
            <h3 className={styles.sectionHeader}>Skills Acquired
            </h3>
            {/* SRS Requirement: Acquired / Total Skills */}
            <span className={styles.skillCount}>
              {profile?.acquiredSkills || 5} / {profile?.totalSkills || 12}
            </span>
          </div>

          <div className={styles.pillsContainer}>
            {["React JS", "Node.js", "UI Design", "Next.js", "Python"].map((skill, i) => (
              <div key={i} className={styles.skillPill}>
                <CheckCircle2 size={14} className={styles.checkIcon} />
                {skill}
              </div>
            ))}
            <div className={`${styles.skillPill} ${styles.morePill}`}>+7 More</div>
          </div>

          <div className={styles.skillProgressBar}>
            <div
              className={styles.skillProgressFill}
              style={{ width: `${(5 / 12) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 10.5. Leaderboard */}
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