import styles from "@/styles/Assignment.module.css";

export default function AssignmentDescription() {
  return (
    <div className={styles.card}>
      <h2>Description</h2>
      <p>
        Build a secure authentication system using JWT. Implement login,
        signup, protected routes, and role-based access.
      </p>
    </div>
  );
}