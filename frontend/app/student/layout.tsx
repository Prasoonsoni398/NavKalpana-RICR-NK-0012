import Sidebar from "@/components/Sidebar/StudentSidebar";
import styles from "@/styles/StudentLayout.module.css";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      {/* 1. Left Sidebar */}
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>

      {/* 2. Centre Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>

    
    </div>
  );
}