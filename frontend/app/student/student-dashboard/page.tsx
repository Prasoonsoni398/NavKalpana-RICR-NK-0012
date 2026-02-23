"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/StudentDashboard.module.css';
import { studentService } from '@/services/student.services'; // API Service
import toast from 'react-hot-toast';
import {
  Search, Bell, Trophy, Flame, Target,
  Star, CheckCircle2, TrendingUp, Clock,
  PlayCircle, Calendar, ChevronRight, AlertCircle, Layout, Briefcase, Building,
  CheckCircle, Users, ExternalLink
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
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* --- Header Section (Original) --- */}
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



        {/* --- 2. NEW: Continue Learning Hero --- */}
        <div className={styles.continueSection} style={{ marginBottom: '30px' }}>
          <div className={styles.continueCard} style={{ background: '#1E293B', color: '#fff', borderRadius: '20px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
            <div style={{ zIndex: 2 }}>
              <span style={{ background: '#FACC15', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>RESUME</span>
              <h2 style={{ margin: '15px 0 5px 0' }}>{myCourses[0].title}</h2>
              <p style={{ color: '#94A3B8', marginBottom: '20px' }}>By {myCourses[0].instructor}</p>
              <button className={styles.viewCourseBtn} style={{ background: '#FACC15', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <PlayCircle size={18} /> Resume Lesson
              </button>
            </div>
            <div style={{ opacity: 0.2, position: 'absolute', right: '-20px' }}>
              <PlayCircle size={150} color="#FACC15" />
            </div>
          </div>
        </div>

        {/* --- Bento Grid Stats (Original) --- */}
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

        {/* --- 3. NEW: Activity Heatmap Section --- */}
        <div className={styles.heatmapSection} style={{ background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
          <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Learning Activity</h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Total: 412 hours this year</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '10px' }}>
            {heatmapData.map((week, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {week.map((day, j) => (
                  <div key={j} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: day === 0 ? '#F1F5F9' : day === 1 ? '#FEF9C3' : day === 2 ? '#FDE047' : '#FACC15' }} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --- Original Middle Row --- */}
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
        {/* --- 1. NEW: Stats Overview Section --- */}
        <div className={styles.statsRow} style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
          {statsOverview.map((stat, i) => (
            <div key={i} className={styles.statMiniCard} style={{ background: '#fff', padding: '15px', borderRadius: '12px', flex: '1', minWidth: '150px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ background: '#FACC1520', color: '#FACC15', padding: '10px', borderRadius: '10px' }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{stat.label}</p>
                <h3 style={{ fontSize: '18px', margin: 0 }}>{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Skills & Courses (Original) */}
        <div className={styles.skillsSection} style={{ marginBottom: '30px' }}>
          <h3><Star size={18} color="#FACC15" /> Skills Acquired</h3>
          <div className={styles.pillsContainer}>
            {profile?.skills?.length > 0 ? profile.skills.map((skill: any, i: number) => (
              <div key={i} className={styles.skillPill}><CheckCircle2 size={14} /> {skill}</div>
            )) : ["React JS", "Node.js", "UI Design", "Next.js", "Python"].map((skill, i) => (
              <div key={i} className={styles.skillPill}><CheckCircle2 size={14} /> {skill}</div>
            ))}
          </div>
        </div>

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
        {/* Job & Internship Section */}
        <div style={{ marginBottom: '35px', background: '#fff', padding: '24px', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              <Briefcase size={22} color="#FACC15" /> Jobs & Internships
            </h3>
            <button style={{ background: 'none', border: 'none', color: '#FACC15', fontWeight: '600', cursor: 'pointer' }}>View All →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { id: 1, role: "Frontend Developer", company: "Google", loc: "Bangalore", type: "Full-time", pay: "₹18-24 LPA" },
              { id: 2, role: "React Intern", company: "Meta", loc: "Remote", type: "Internship", pay: "₹45k/mo" },
              { id: 3, role: "SDE Intern", company: "Amazon", loc: "Hyderabad", type: "Internship", pay: "₹60k/mo" }
            ].map(job => (
              <div key={job.id} style={{ padding: '16px', borderRadius: '14px', border: '1px solid #F1F5F9', background: '#F8FAFC', transition: 'transform 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Building size={20} color="#94A3B8" />
                  <span style={{ fontSize: '10px', fontWeight: '700', background: '#FEF9C3', color: '#854D0E', padding: '3px 10px', borderRadius: '20px' }}>{job.type.toUpperCase()}</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1E293B' }}>{job.role}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748B' }}>{job.company} • {job.loc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#FACC15', fontSize: '15px' }}>{job.pay}</span>
                  <button style={{ background: '#000', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Alumni Network Section */}
        <div style={{ marginBottom: '35px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', fontSize: '20px', fontWeight: '700' }}>
            <Users size={22} color="#FACC15" /> Notable Alumni
          </h3>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
            {[
              { id: 1, name: "Sandeep Maheshwari", role: "SDE-2 @ Microsoft", batch: "Batch 2022", img: "https://i.pravatar.cc/150?u=1" },
              { id: 2, name: "Priya Sharma", role: "Product Manager @ Amazon", batch: "Batch 2021", img: "https://i.pravatar.cc/150?u=2" },
              { id: 3, name: "Aman Gupta", role: "Full Stack @ Uber", batch: "Batch 2023", img: "https://i.pravatar.cc/150?u=3" },
              { id: 4, name: "Rahul Verma", role: "Data Scientist @ Tesla", batch: "Batch 2020", img: "https://i.pravatar.cc/150?u=4" }
            ].map(al => (
              <div key={al.id} style={{ minWidth: '200px', background: '#fff', padding: '20px', borderRadius: '18px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <img src={al.img} style={{ width: '70px', height: '70px', borderRadius: '50%', marginBottom: '12px', border: '3px solid #FACC15', objectFit: 'cover' }} alt={al.name} />
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1E293B' }}>{al.name}</h4>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#FACC15', fontWeight: '600' }}>{al.role}</p>
                <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#94A3B8' }}>{al.batch}</p>
                <button style={{ width: '100%', background: 'none', border: '1px solid #E2E8F0', padding: '7px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontWeight: '500' }}>
                  Connect <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- RIGHT SIDEBAR (Enhanced) --- */}
      <aside className={styles.rightPanel}>

        <div className={styles.eventCalendarCard}>
          <div className={styles.calendarHeader}>
            <h3 className={styles.sidebarTitle}>
              <Calendar size={18} className={styles.calendarIcon} /> Event Calendar
            </h3>
            <div className={styles.navActions}>
              <button onClick={prevMonth} className={styles.navBtn}>&lt;</button>
              {/* यहाँ variable के नाम आपके कोड के हिसाब से होने चाहिए */}
              <span className={styles.currentMonth}>
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button onClick={nextMonth} className={styles.navBtn}>&gt;</button>
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className={styles.weekdayLabel}>{day}</div>
            ))}

            {/* महीने की शुरुआत के खाली स्लॉट्स */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptySlot}></div>
            ))}

            {/* महीने के दिन */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(date => {
              const monthStr = (currentMonth + 1).toString().padStart(2, '0');
              const dateStr = `${currentYear}-${monthStr}-${date.toString().padStart(2, '0')}`;
              const hasEvent = !!events[dateStr];
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, date).toDateString();

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
          {/* TypeScript Friendly Event Modal */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.eventModal} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <h4 className={styles.modalTitle}>Set Event: {selectedDate}</h4>
                <input
                  type="text"
                  autoFocus
                  value={newEventName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEventName(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && saveEvent()}
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
        <div className={styles.monthlyTracker}>
          <div className={styles.trackerHeader}>
            <h3>Performance</h3>
            <div className={styles.filterGroup}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {/* यहाँ months की जगह monthNames कर दें */}
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>{m.substring(0, 3)}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.filterSelect}
              >
                {/* सुनिश्चित करें कि years भी ऊपर डिफाइन है, नहीं तो [2024, 2025, 2026] लिख दें */}
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
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

        {/* --- 4. NEW: Upcoming Deadlines --- */}
        <div className={styles.activitySection} style={{ marginBottom: '25px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="#FACC15" /> Upcoming Quizzes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#F8FAFC', borderRadius: '10px' }}>
              <div style={{ background: '#FACC15', color: '#000', padding: '5px', borderRadius: '8px', textAlign: 'center', minWidth: '40px' }}>
                <span style={{ fontSize: '10px', display: 'block' }}>FEB</span>
                <strong style={{ fontSize: '14px' }}>24</strong>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '13px', margin: 0 }}>React Final Quiz</h4>
                <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>10:00 AM • 45 Mins</p>
              </div>
              <ChevronRight size={14} color="#94A3B8" />
            </div>
          </div>
        </div>



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

      </aside >

    </div >
  );
}