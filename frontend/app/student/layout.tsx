"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/StudentSidebar";
import styles from "@/styles/StudentLayout.module.css";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCourseClassroom = pathname?.startsWith("/student/course/");

  return (
    <div className={styles.container}>
      {/* 🚫 अगर हम क्लासरूम में हैं, तो यह पूरा Wrapper गायब हो जाएगा */}
      {!isCourseClassroom && (
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
      )}

      {/* 2. Centre Main Content */}
      <main className={`${styles.mainContent} ${isCourseClassroom ? styles.fullWidth : ""}`}>
        {children}
      </main>
    </div>
  );
}