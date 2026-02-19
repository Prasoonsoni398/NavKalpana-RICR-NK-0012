"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: 'Dashboard', path: '/deshboard/teacher-deshboard', icon: '🏠' },
    { name: 'My Courses', path: '/deshboard/teacher-deshboard/my-courses', icon: '📚' },
    { name: 'Create Course', path: '/deshboard/teacher-deshboard/add-course', icon: '➕' },
    { name: 'Students', path: '/deshboard/teacher-deshboard/students', icon: '👥' },
    { name: 'Earnings', path: '/deshboard/teacher-deshboard/earnings', icon: '💰' },
    { name: 'Settings', path: '/deshboard/teacher-deshboard/settings', icon: '⚙️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <h2 className={styles.logoText}>Edu<span>Leaf</span></h2>
      </div>

      <nav className={styles.navMenu}>
        <p className={styles.menuLabel}>Teacher Menu</p>
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path} 
            className={isActive(item.path) ? styles.activeLink : styles.link}
          >
            <span className={styles.icon}>{item.icon}</span> {item.name}
          </Link>
        ))}
        
        <div className={styles.divider} />
        <Link href="/logout" className={styles.logoutLink}>
          <span className={styles.icon}>🚪</span> Logout
        </Link>
      </nav>
    </aside>
  );
}