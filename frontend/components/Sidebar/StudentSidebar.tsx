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
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const StudentSidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    // 1️⃣ Clear localStorage
    localStorage.clear();
    sessionStorage.clear();

    // 3️⃣ Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // 4️⃣ Redirect to login page
    router.push("/auth/student-login");

    // 5️⃣ Optional hard refresh
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
      {/* 3. Collapse Button */}
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>S</div>
        {!isCollapsed && (
          <span className={styles.logoText}>
            Skill<span>verse</span>
          </span>
        )}
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${
              pathname === item.path ? styles.navActive : ""
            }`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className={styles.logoutWrapper}>
        <Button href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className={styles.logoutBtn}>
          <LogOut size={20}/> 
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default StudentSidebar;