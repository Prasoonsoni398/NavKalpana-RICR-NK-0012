"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Sidebar.module.css';
import { Dispatch, SetStateAction } from "react";
import { 
  LayoutDashboard, BookOpen, GraduationCap,
  BookUser, Settings, LogOut,
  ChevronLeft, ChevronRight, Calendar, Flame 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/student/student-dashboard' },
    { name: 'Courses', icon: <BookOpen size={20}/>, path: '/student/my-courses' },
    { name: 'Assignments', icon: <Flame size={20}/>, path: '/student/assignments' },
    { name: 'Quizzes', icon: <GraduationCap size={20}/>, path: '/student/quiz-model' },
    { name: 'Attendance', icon: <Calendar size={20}/>, path: '/student/attendance/1' },
    { name: 'Learning Support', icon: <BookUser size={20}/>, path: '/student/learning-support' },
    { name: 'Settings', icon: <Settings size={20}/>, path: '/settings' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* 3. Collapse Button */}
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