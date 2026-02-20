"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>
        EduLeaf
      </Link>

      {/* Hamburger Button */}
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <AnimatePresence>
        {(menuOpen || typeof window !== "undefined") && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${styles.navLinks} ${
              menuOpen ? styles.active : ""
            }`}
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/courses">Courses</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>

            {/* Dropdown */}
            <li className={styles.dropdown}>
              <button
                className={styles.dropbtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Login / Join <span>▾</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className={styles.dropdownContent}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/auth/student-login">
                      Student Portal
                    </Link>
                    <Link href="/auth/teacher-login">
                      Teacher Portal
                    </Link>
                    <Link href="/auth/admin-login">
                      Admin Login
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}