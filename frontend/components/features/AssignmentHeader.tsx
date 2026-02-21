import styles from "@/styles/Assignment.module.css";

export default function AssignmentHeader({ title, deadline, status }: any) {
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      <div className={styles.meta}>
        <span>Deadline: {deadline.toLocaleString()}</span>
        <span className={`${styles.badge} ${styles[status.replace(" ", "")]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}