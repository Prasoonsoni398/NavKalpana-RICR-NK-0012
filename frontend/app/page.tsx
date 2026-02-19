// src/app/page.tsx
import styles from '@/styles/Home.module.css';
import CourseCard from '../components/features/CourseCard';

/**
 * Home Page Component
 * Theme: Green and White
 * Structure: Hero Section + Featured Courses Section
 */
export default function Home() {
  return (
    <main>
      {/* 1. Hero Section */}
      <section className={styles.heroWrapper}>
        <h1 className={styles.title}>
          Unlock Your Potential <br /> with EduLeaf
        </h1>
        
        <p className={styles.subtitle}>
          A comprehensive Learning Management System designed to provide 
          a seamless educational experience with a modern Green-White interface.
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn}>
            Explore Courses
          </button>
          <button className={styles.secondaryBtn}>
            Our Mission
          </button>
        </div>
      </section>

      {/* 2. Featured Courses Section */}
      <section style={{ padding: '60px 5%', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: 'var(--primary-green)', 
          marginBottom: '40px',
          fontSize: '2rem' 
        }}>
          Featured Courses
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px',
          justifyItems: 'center'
        }}>
          <CourseCard 
            title="Next.js Mastery" 
            category="Development" 
            price="$49" 
          />
          <CourseCard 
            title="UI/UX with CSS" 
            category="Design" 
            price="$29" 
          />
          <CourseCard 
            title="Full Stack LMS" 
            category="Engineering" 
            price="$99" 
          />
        </div>
      </section>
    </main>
  );
}