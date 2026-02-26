"use client";

import { useState } from "react"; 
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/StudentSidebar";
import styles from "@/styles/StudentLayout.module.css";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const pathname = usePathname();
  const isCourseClassroom = pathname?.startsWith("/student/course/");

  return (
    <div className={styles.container}>
      {!isCourseClassroom && (
        <div className={styles.sidebarWrapper}>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
      )}
      <main 
        className={`${styles.mainContent} ${isCourseClassroom ? styles.fullWidth : ""}`}
        style={{ 
          marginLeft: isCourseClassroom ? "0" : (isCollapsed ? "80px" : "260px"),
          width: isCourseClassroom ? "100%" : `calc(100% - ${isCollapsed ? "80px" : "260px"})`,
          transition: "all 0.3s ease" 
        }}
      >
        {children}
      </main>
    </div>
  );
}