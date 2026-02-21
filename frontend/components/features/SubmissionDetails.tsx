import styles from "@/styles/Assignment.module.css";

export default function SubmissionDetails({ submission }: any) {
  return (
    <div className={`${styles.card} ${styles.submissionCard}`}>
      
      {/* Header Row */}
      <div className={styles.headerRow}>
        <h2>Submission Details</h2>

        <span
          className={`${styles.statusTag} ${
            styles[submission.status.replace(" ", "")]
          }`}
        >
          {submission.status}
        </span>
      </div>

      {/* Info Grid */}
      <div className={styles.infoGrid}>

        <div className={styles.infoBox}>
          <span className={styles.label}>Submission Time</span>
          <span className={styles.value}>
            {submission.submissionTime.toLocaleString()}
          </span>
        </div>

        <div className={styles.infoBox}>
          <span className={styles.label}>Late Submission</span>

          <span
            className={`${styles.lateBadge} ${
              submission.lateFlag ? styles.lateYes : styles.lateNo
            }`}
          >
            {submission.lateFlag ? "Yes" : "No"}
          </span>
        </div>

      </div>
    </div>
  );
}