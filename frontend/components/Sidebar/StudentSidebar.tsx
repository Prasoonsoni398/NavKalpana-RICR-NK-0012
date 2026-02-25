"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/Sidebar.module.css';
import { Dispatch, SetStateAction } from "react";
import { 
  LayoutDashboard, BookOpen, GraduationCap,
  BookUser, Settings, LogOut,
  ChevronLeft, ChevronRight, Calendar, Flame 
} from 'lucide-react';
import { Button } from '@mui/material';

// 1. Types define करें
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // ✅ LOGOUT FUNCTION (Clean & Safe)
  const handleLogout = () => {
    // 1️⃣ Clear Storage
    localStorage.clear();
    sessionStorage.clear();

    // 2️⃣ Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // 3️⃣ Redirect & Refresh
    router.push("/auth/student-login");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

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
        <Button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
          sx={{ color: 'inherit', textTransform: 'none', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={20}/> 
          {!isCollapsed && <span style={{ marginLeft: '12px' }}>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;