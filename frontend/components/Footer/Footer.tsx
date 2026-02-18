// src/components/layout/Footer.tsx
import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* About Section */}
        <div className={styles.footerSection}>
          <h3>EduLeaf</h3>
          <p>
            Providing high-quality online education to empower learners 
            worldwide with cutting-edge technology and expert instruction.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/courses">All Courses</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h3>Contact</h3>
          <ul>
            <li>Email: support@eduleaf.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Location: Remote</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={styles.copyright}>
        <p>&copy; {currentYear} Is Controller. All Rights Reserved.</p>
      </div>
    </footer>
  );
}