"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/Sidebar.module.css';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap,
  BookUser, 
  Settings, 
  LogOut,
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Flame,
  Menu,
  X,
  User,
  HelpCircle,
  Award,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const StudentSidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsCollapsed]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Redirect to login
    router.push("/auth/student-login");
    
    // Optional: Show logout message
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/student-dashboard' },
    { name: 'My Courses', icon: <BookOpen size={20} />, path: '/student/my-courses' },
    { name: 'Assignments', icon: <Flame size={20} />, path: '/student/assignments' },
    { name: 'Quizzes', icon: <GraduationCap size={20} />, path: '/student/quiz-model' },
    { name: 'Attendance', icon: <Calendar size={20} />, path: '/student/attendance/1'},
    { name: 'Learning Support', icon: <BookUser size={20} />, path: '/student/learning-support' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/student/settings' },
  ];

  const bottomMenuItems = [
    { name: 'Help', icon: <HelpCircle size={20} />, path: '/student/help' },
    { name: 'Profile', icon: <User size={20} />, path: '/student/profile' },
  ];

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className={styles.mobileHeader}>
          <button 
            className={styles.menuButton}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <div className={styles.mobileLogo}>
            <span className={styles.mobileLogoIcon}>S</span>
            <span className={styles.mobileLogoText}>Skillverse</span>
          </div>
          
          <div className={styles.mobileActions}>
            <button className={styles.mobileNotification}>
              <Bell size={20} />
              <span className={styles.notificationBadge}>3</span>
            </button>
          </div>
        </header>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}
        initial={false}
        animate={{ 
          width: isMobile 
            ? (isMobileOpen ? 280 : 0) 
            : (isCollapsed ? 80 : 280)
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button 
            className={styles.closeButton}
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        )}

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <button 
            className={styles.toggleBtn} 
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}

        {/* Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>S</div>
          {!isCollapsed && (
            <motion.span 
              className={styles.logoText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Skill<span>verse</span>
            </motion.span>
          )}
        </div>

        {/* User Profile Summary */}
        {!isCollapsed && (
          <motion.div 
            className={styles.userProfile}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.userAvatar}>
              <User size={24} />
            </div>
            <div className={styles.userInfo}>
              <h4>John Doe</h4>
              <p>Student</p>
            </div>
          </motion.div>
        )}

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && (
                <motion.span 
                  className={styles.navText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.name}
                </motion.span>
              )}
              {pathname === item.path && (
                <motion.div 
                  className={styles.activeIndicator}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className={styles.bottomMenu}>
          {bottomMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!isCollapsed && (
                <motion.span 
                  className={styles.navText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}

          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className={`${styles.navItem} ${styles.logoutBtn}`}
          >
            <span className={styles.navIcon}><LogOut size={20} /></span>
            {!isCollapsed && (
              <motion.span 
                className={styles.navText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>

        {/* Version Info */}
        {!isCollapsed && (
          <div className={styles.versionInfo}>
            <p>Version 2.0.0</p>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default StudentSidebar;