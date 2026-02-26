"use client";

import styles from "@/styles/Jobs.module.css";

interface JobProps {
  type: string;
  company: string;
  role: string;
  skills: string[];
  link: string;
}

const JobCard = ({ type, company, role, skills, link }: JobProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.topSection}>
        <span className={styles.badge}>{type}</span>
        <h3>{role}</h3>
        <p className={styles.company}>{company}</p>
      </div>

      <div className={styles.skills}>
        {skills.map((skill, index) => (
          <span key={index} className={styles.skillTag}>
            {skill}
          </span>
        ))}
      </div>

      <a href={link} target="_blank" className={styles.applyBtn}>
        Apply Now
      </a>
    </div>
  );
};

export default JobCard;