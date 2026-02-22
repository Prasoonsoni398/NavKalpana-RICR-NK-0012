import styles from '@/styles/Tutorials.module.css';
import Link from 'next/link';

export default function TutorialsPage() {
  const courses = [
    {
      id: 1,
      title: "Next.js 14 for Beginners",
      desc: "Master the latest Next.js features like App Router, Server Actions and more.",
      category: "Web Development",
      img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964"
    },
    {
      id: 2,
      title: "Python Mastery 2026",
      desc: "Complete Python guide from basics to advanced automation and AI.",
      category: "Programming",
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070"
    },
    {
      id: 3,
      title: "React Native Mobile App",
      desc: "Build cross-platform Android and iOS apps using React Native and Expo.",
      category: "Mobile Dev",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Free <span>Tutorials</span></h1>
        <p style={{color: '#94A3B8'}}>Quality coding education for everyone, free of cost.</p>
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.card}>
            <img src={course.img} alt={course.title} className={styles.thumbnail} />
            <div className={styles.content}>
              <span className={styles.category}>{course.category}</span>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.description}>{course.desc}</p>
              <Link href={`/tutorials/${course.id}`} className={styles.btn}>
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}