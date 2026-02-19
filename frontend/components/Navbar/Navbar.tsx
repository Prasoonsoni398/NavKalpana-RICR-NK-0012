"use client";

import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      {/* Logo Section */}
      <Link href="/" className={styles.logo}>
        EduLeaf
      </Link>

      {/* Navigation Links */}
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/courses">Courses</Link></li>
        <li><Link href="/about">About Us</Link></li>
        
        {/* Auth Dropdown */}
        <li className={styles.dropdown}>
          <button className={styles.dropbtn}>
            Login / Join
            <span>▾</span>
          </button>
          <div className={styles.dropdownContent}>
            <Link href="/auth/student">Student Portal</Link>
            <Link href="/auth/teacher">Teacher Portal</Link>
            <Link href="/auth/admin-login">Admin Login</Link>
          </div>
        </li>
      </ul>
    </nav>
  );
}