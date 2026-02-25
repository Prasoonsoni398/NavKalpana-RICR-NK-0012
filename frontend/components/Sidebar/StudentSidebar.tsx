"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Sidebar.module.css';
import { 
  LayoutDashboard, BookOpen, FileText, GraduationCap,
  Flame, BookUser, NotepadText, Settings, LogOut,
  ChevronLeft, ChevronRight  
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  // साइडबार के खुलने या बंद होने के लिए स्टेट
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/student/student-dashboard' },
    { name: 'Courses', icon: <BookOpen size={20}/>, path: '/student/my-courses' },
    { name: 'Assignments', icon: <Flame size={20}/>, path: '/student/assignments' },
    { name: 'Quizzes', icon: <GraduationCap size={20}/>, path: '/student/quiz-model' },
    { name: 'Learning Support', icon: <BookUser size={20}/>, path: '/student/learning-support' },
    { name: 'Settings', icon: <Settings size={20}/>, path: '/settings' },
    { name: 'Logout', icon: <LogOut size={20}/>, path: '/logout' },

  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Collapse Button */}
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>S</div>
          {!isCollapsed && <span className={styles.logoText}>Skill<span>verse</span></span>}
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} 
            className={`${styles.navItem} ${pathname === item.path ? styles.navActive : ''}`}>
            {item.icon} 
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className={styles.logoutWrapper}>
        <Link href="/logout" className={styles.logoutBtn}>
          <LogOut size={20}/> 
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;