"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // useRouter जोड़ा गया
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Mock state: बाद में इसे Redux या Auth Context से बदलें
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userRole, setUserRole] = useState("student"); 

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => { setMenuOpen(false); setDropdownOpen(false); };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* --- Logo --- */}
        <Link href="/" className={styles.logo}>
          Edu<span>Leaf</span>
        </Link>

        {/* --- Navigation Links --- */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.mobileActive : ""}`}>
          <li><Link href="/" className={pathname === "/" ? styles.activeLink : ""}>Home</Link></li>
          <li><Link href="/courses" className={pathname === "/courses" ? styles.activeLink : ""}>Courses</Link></li>
          
          {isLoggedIn && (
            <li>
              <Link href={userRole === "student" ? "/dashboard/student" : "/dashboard/teacher-dashboard"}>
                Dashboard
              </Link>
            </li>
          )}

          {/* --- Dropdown / Portal Selector --- */}
          <li className={styles.dropdownWrapper}>
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
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className={styles.dropdownContent}
                >
                  {!isLoggedIn ? (
                    <>
                      <div className={styles.dropdownLabel}>Select Portal</div>
                      <div className={styles.dropdownOptions}>
                        {/* ✅ यहाँ बटन के बजाय Link इस्तेमाल किया है जो Login Page पर ले जाएगा */}
                        <Link href="/auth/student-login" className={styles.portalLink}>
                          Student Login
                        </Link>
                        <Link href="/auth/teacher-login" className={styles.portalLink}>
                          Teacher Login
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.userInfo}><p>Welcome, {userRole}</p></div>
                      <Link href="/profile">My Settings</Link>
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

        {/* --- Mobile Toggle --- */}
        <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle Menu">
          <div className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}>
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </nav>
  );
}