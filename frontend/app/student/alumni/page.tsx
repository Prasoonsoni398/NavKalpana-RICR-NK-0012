import Image from "next/image";
import { dummyAlumni } from "@/lib/Alumni";
import styles from "@/styles/Alumni.module.css";

export default function AlumniPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Our Alumni Network</h1>

      <div className={styles.grid}>
        {dummyAlumni.map((alum) => (
          <div key={alum.id} className={styles.card}>

            {/* Profile Image */}
            <div className={styles.avatar}>
              <Image
                src={alum.image}
                alt={alum.name}
                fill
                className={styles.profileImg}
              />
            </div>

            <h2 className={styles.name}>{alum.name}</h2>

            <div className={styles.companyWrapper}>
              <div className={styles.companyInner}>
                <div className={styles.companyFront}>
                  {alum.company}
                </div>
                <div className={styles.companyBack}>
                  {alum.company}
                </div>
              </div>
            </div>

            <p className={styles.position}>
              {alum.position}
            </p>

            <a
              href={alum.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              View LinkedIn →
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}