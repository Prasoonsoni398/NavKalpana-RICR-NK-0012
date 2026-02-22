"use client";
import Link from 'next/link';
import { LayoutDashboard, BookOpen, GraduationCap, Settings, NotepadText, Contact, BookUser } from 'lucide-react';
import styles from '@/styles/Sidebar.module.css';

const StudentSidebar = () => {
  return (
    <aside style={{ width: '260px', backgroundColor: '#1E293B', height: '100vh', padding: '20px', borderRight: '1px solid #334155' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#3B82F6', fontSize: '24px' }}>EduLeaf 🎓</h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link href="/student/student-dashboard" style={navStyle}><LayoutDashboard size={20}/>Home</Link>
        <Link href="/student/my-courses" style={navStyle}><BookOpen size={20}/>Courses</Link>
        <Link href="/dashboard/student/certificates" style={navStyle}><GraduationCap size={20}/>Tutorials</Link>
        <Link href="/dashboard/student/settings" style={navStyle}><BookUser  size={20}/> Blogs</Link>
        <Link href="/dashboard/student/settings" style={navStyle}><NotepadText size={20}/>Notes</Link>
        <Link href="/dashboard/student/settings" style={navStyle}><Contact  size={20}/>Contact</Link>
        <Link href="/dashboard/student/settings" style={navStyle}><Settings size={20}/>Settings</Link>
      </nav>

      <div className={styles.divider} />
        <Link href="/logout" className={styles.logoutLink}>
          <span className={styles.icon}>🚪</span> Logout
        </Link>
    </aside>
  );
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#E2E8F0',
  textDecoration: 'none',
  padding: '10px',
  borderRadius: '8px',
  transition: '0.3s',
};

export default StudentSidebar;