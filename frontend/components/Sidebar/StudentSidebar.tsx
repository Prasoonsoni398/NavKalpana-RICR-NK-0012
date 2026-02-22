"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/StudentDashboard.module.css';
import { 
  LayoutDashboard, BookOpen, FileText, GraduationCap,
  Flame, BookUser, NotepadText, Settings, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/student/student-dashboard' },
    { name: 'Courses', icon: <BookOpen size={20}/>, path: '/student/my-courses' },
    { name: 'Chapter', icon: <FileText size={20}/>, path: '/student/chapters' },
    { name: 'Tutorials', icon: <GraduationCap size={20}/>, path: '/student/tutorials' },
    { name: 'Assignments', icon: <Flame size={20}/>, path: '/student/assignments' },
    { name: 'Blogs', icon: <BookUser size={20}/>, path: '/student/blogs' }, 
    { name: 'Notes', icon: <NotepadText size={20}/>, path: '/notes' },  
    { name: 'Settings', icon: <Settings size={20}/>, path: '/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Quyl.</div>
      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} 
            className={`${styles.navItem} ${pathname === item.path ? styles.navActive : ''}`}>
            {item.icon} <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.logoutWrapper}>
        <Link href="/logout" className={styles.logoutBtn}>
          <LogOut size={20}/> <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;