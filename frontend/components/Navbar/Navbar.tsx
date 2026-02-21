"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Mock state: In a real app, use your Auth Context here
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userRole, setUserRole] = useState("student"); // 'student' or 'teacher'

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => { setMenuOpen(false); setDropdownOpen(false); };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          Edu<span>Leaf</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <li><Link href="/" className={pathname === "/" ? styles.activeLink : ""}>Home</Link></li>
          <li><Link href="/courses" className={pathname === "/courses" ? styles.activeLink : ""}>Courses</Link></li>
          
          {isLoggedIn && userRole === "student" && (
            <li><Link href="/dashboard/student">My Learning</Link></li>
          )}

          {/* Dynamic Action Button / Dropdown */}
          <li className={styles.dropdown}>
            {isLoggedIn ? (
              <div className={styles.userProfile} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className={styles.avatar}>{userRole[0].toUpperCase()}</div>
                <span className={styles.desktopOnly}>Account ▾</span>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                Join Now
              </button>
            )}

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.dropdownContent}
                >
                  {!isLoggedIn ? (
                    <>
                      <Link href="/auth/student-login" onClick={closeMenu}>Student Portal</Link>
                      <Link href="/auth/teacher-login" onClick={closeMenu}>Teacher Portal</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={closeMenu}>Settings</Link>
                      <button className={styles.logoutBtn} onClick={() => setIsLoggedIn(false)}>
                        Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle Menu">
          <div className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}></div>
        </button>
      </div>
    </nav>
  );
}