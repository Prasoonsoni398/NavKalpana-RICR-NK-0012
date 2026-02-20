"use client";

import styles from "@/styles/About.module.css";
import { motion, Variants } from "framer-motion";

/* Page animation variants */

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0,  },
  visible: { opacity: 1,  }
};

export default function AboutPage() {
  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        variants={sectionVariants}
      >
        <h1>About Our LMS</h1>
        <p>
          Empowering students with structured learning,
          real-world skills, and career-focused education.
        </p>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className={styles.missionVision}
        variants={sectionVariants}
      >
        <div className={styles.card}>
          <h2>🎯 Our Mission</h2>
          <p>
            To provide high-quality, structured and practical
            learning experiences that help students master
            technical skills efficiently.
          </p>
        </div>

        <div className={styles.card}>
          <h2>🚀 Our Vision</h2>
          <p>
            To become a leading digital learning platform
            that bridges the gap between education and industry.
          </p>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        className={styles.features}
        variants={sectionVariants}
      >
        <h2>Why Choose Our LMS?</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>📚 Structured Courses</h3>
            <p>Step-by-step learning path with clear roadmap.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>💡 Practical Learning</h3>
            <p>Hands-on projects and real-world examples.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>📈 Progress Tracking</h3>
            <p>Track your learning progress easily.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>🌿 Green Learning Environment</h3>
            <p>Clean and distraction-free interface.</p>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className={styles.team}
        variants={sectionVariants}
      >
        <h2>Meet Our Team</h2>

        <div className={styles.teamGrid}>
          <div className={styles.teamCard}>
            <div className={styles.avatar}></div>
            <h3>John Doe</h3>
            <p>Founder & Lead Developer</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatar}></div>
            <h3>Jane Smith</h3>
            <p>Course Architect</p>
          </div>

          <div className={styles.teamCard}>
            <div className={styles.avatar}></div>
            <h3>Robert Brown</h3>
            <p>DSA Mentor</p>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}