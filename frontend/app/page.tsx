"use client";

import styles from '@/styles/Landing.module.css';
import { useState } from 'react';
import { Lightbulb, Layers, Code, DollarSign, BookOpen, BarChart, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {

  const [showLogins, setShowLogins] = useState(false);
  // 1. Data arrays inside the function
  const courseCategories = [
    {
      title: "Web Development",
      desc: "Learn HTML, CSS, JavaScript and modern frameworks to build responsive websites.",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072"
    },
    {
      title: "Data Science & AI",
      desc: "Master Python, data analysis, machine learning and artificial intelligence with projects.",
      img: "https://images.unsplash.com/photo-1551288049-bbbda5366392?q=80&w=2070"
    },
    {
      title: "Data Structures & Algorithms",
      desc: "Learn DSA and crack interviews at top companies like Google and Microsoft.",
      img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128"
    }
  ];

  const offerings = [
    { title: "Beginner-Friendly", desc: "Step-by-step courses designed for absolute beginners.", icon: <Lightbulb /> },
    { title: "Advanced Concepts", desc: "Deep dive into advanced topics and frameworks.", icon: <Layers /> },
    { title: "Real-World Projects", desc: "Learn by building real-world projects and gain experience.", icon: <Code /> },
    { title: "Affordable Pricing", desc: "Access premium courses at prices tailored for everyone.", icon: <DollarSign /> },
    { title: "Comprehensive Resources", desc: "Gain access to a variety of coding resources.", icon: <BookOpen /> },
    { title: "Industry Insights", desc: "Stay updated with the latest trends and insights.", icon: <BarChart /> }
  ];

  return (
    <div className={styles.wrapper}>
      {/* 1. HERO & STATS SECTION */}
      <section className={styles.heroWrapper}>
        <div className={styles.content}>
          <span className={styles.badge}>Learn coding the right way</span>
          <h1 className={styles.title}>Welcome to <span>EduLeaf</span></h1>
          <div className={styles.typingText}>Learn Web Development |</div>
          <p className={styles.subtitle}>
            Confused about which course to take? We've got you covered!
            EduLeaf is our effort to prepare you for real-world projects.
          </p>

          <div className={styles.btnGroup}>
            <Link href="/auth/student-login" className={styles.primaryBtn}>
              Explore Courses
            </Link>
            <button className={styles.secondaryBtn}>Read Articles</button>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500K+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5.0</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSES CATEGORY SECTION */}
      <section className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>Code Smarter with Real-World Practice</h2>
        <p className={styles.sectionDesc}>
          At EduLeaf, you don't just learn code, you engage in practical exercises that
          reflect real-world scenarios. We prepare you for real-world projects.
        </p>

        <div className={styles.courseGrid}>
          {courseCategories.map((course, index) => (
            <div key={index} className={styles.courseCard}>
              <img src={course.img} alt={course.title} className={styles.imagePlaceholder} />
              <div className={styles.cardContent}>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUCCESS METRICS SECTION */}
      <section className={styles.successSection}>
        <h2 className={styles.successTitle}>Empowering Aspiring Developers to Build Their Future in Tech!</h2>
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Students land their first job in</span>
            <span className={styles.metricValue}>6 months</span>
            <span className={styles.metricSubText}>on average</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Over</span>
            <span className={styles.metricValue}>7,000,000+</span>
            <span className={styles.metricSubText}>students trained</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Total YouTube Views</span>
            <span className={styles.metricValue}>1 Billion+</span>
            <span className={styles.metricSubText}>views and counting</span>
          </div>
        </div>
      </section>

      {/* 4. CORE OFFERINGS SECTION */}
      <section className={styles.offeringsSection}>
        <span style={{ color: '#3B82F6', fontWeight: '600', display: 'block', textAlign: 'center' }}>Courses</span>
        <h2 className={styles.sectionTitle}>Master Coding with Our Core Offerings</h2>
        <div className={styles.offeringGrid}>
          {offerings.map((item, i) => (
            <div key={i} className={styles.offeringCard}>
              <div className={styles.iconCircle}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className={styles.testimonialSection}>
        <h2 className={styles.sectionTitle}>Testimonials</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testiCard}>
            <div className={styles.quoteIcon}>"</div>
            <p style={{ color: '#E2E8F0' }}>I don't have words to thank this man, I'm really grateful to have this channel. If you're a mere beginner, you can trust this guy.</p>
            <span className={styles.userName}>Mohit Kumar</span>
            <span className={styles.userTitle}>Web Developer</span>
          </div>
          <div className={styles.testiCard}>
            <div className={styles.quoteIcon}>"</div>
            <p style={{ color: '#E2E8F0' }}>For everyone who wants to level up their skills - seriously, this channel is for you! Both basic and advanced stacks are covered.</p>
            <span className={styles.userName}>Rakesh Shetty</span>
            <span className={styles.userTitle}>Web Developer</span>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>Start Your Coding Journey</h2>
        <p style={{ color: '#CBD5E1', fontSize: '1.2rem', marginBottom: '30px' }}>
          Learn coding step-by-step with India's most loved programming mentor.
        </p>

        {/* मुख्य बटन - इस पर क्लिक करने से नीचे के ऑप्शंस खुलेंगे */}
        <button
          className={styles.primaryBtn}
          onClick={() => setShowLogins(!showLogins)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          Join Now <ChevronDown size={18} style={{ transform: showLogins ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
        </button>

        {/* लॉगिन ऑप्शंस - सिर्फ तभी दिखेंगे जब showLogins true होगा */}
        {showLogins && (
          <div className={styles.loginButtonGroup}>
            <Link href="/auth/teacher-login" className={styles.roleLink} style={{ borderColor: '#0D9488' }}>
              Teacher Portal
            </Link>
            <Link href="/auth/admin-login" className={styles.roleLink} style={{ borderColor: '#475569' }}>
              Admin Control
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}