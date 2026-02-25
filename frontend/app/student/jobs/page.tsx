"use client";

import { useState } from "react";
import { dummyJobs } from "@/lib/Jobs";
import styles from "@/styles/Jobs.module.css";

type FilterType = "All" | "Internship" | "Job";

export default function JobsPage() {
    const [filter, setFilter] = useState<FilterType>("All");

    const filteredJobs =
        filter === "All"
            ? dummyJobs
            : dummyJobs.filter((job) => job.type === filter);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>
                Job & Internship Opportunities
            </h1>

            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                {["All", "Internship", "Job"].map((type) => (
                    <button
                        key={type}
                        className={`${styles.tab} ${filter === type ? styles.activeTab : ""
                            }`}
                        onClick={() => setFilter(type as FilterType)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className={styles.grid}>
                {filteredJobs.map((job) => (
                    <div key={job.id} className={styles.card}>
                        <span className={styles.badge}>{job.type}</span>

                        <h2 className={styles.role}>{job.role}</h2>

                        <div className={styles.company}>
                            {job.company}
                        </div>

                        <div className={styles.skillsSection}>
                            <p className={styles.label}>Required Skills</p>
                            <div className={styles.skills}>
                                {job.skills.map((skill, index) => (
                                    <div key={index} className={styles.skillCard}>
                                        <div className={styles.skillInner}>
                                            <div className={styles.skillFront}>{skill}</div>
                                            <div className={styles.skillBack}>✔ {skill}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.button}
                        >
                            Apply Now →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}