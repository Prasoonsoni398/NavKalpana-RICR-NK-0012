import Sidebar from "@/components/Sidebar/StudentSidebar";
import styles from "@/styles/StudentLayout.module.css";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}