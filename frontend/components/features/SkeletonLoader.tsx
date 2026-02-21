// SkeletonLoader.tsx
'use client';

import React from 'react';
import styles from '@/styles/CourseDetail.module.css';

const SkeletonLoader: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      {/* Hero Section */}
      <div className={styles.skeletonHero}>
        <div className={styles.skeletonHeroInner}>
          {[
            ['40%', 12],
            ['65%', 48],
            ['50%', 16],
            ['35%', 14],
          ].map(([w, h], i) => (
            <div
              key={i}
              className={styles.skeletonBar}
              style={{ width: w as string, height: h as number }}
            />
          ))}
        </div>
      </div>

      {/* Body Section */}
      <div className={styles.skeletonBody}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className={styles.skeletonBarLight} style={{ height: 260, borderRadius: 12 }} />
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={styles.skeletonBarLight}
              style={{ height: 60, borderRadius: 8 }}
            />
          ))}
        </div>
        <div className={styles.skeletonBarLight} style={{ height: 280, borderRadius: 12 }} />
      </div>
    </div>
  );
};

export default SkeletonLoader;