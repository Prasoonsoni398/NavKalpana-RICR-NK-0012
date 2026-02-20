"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import styles from "@/styles/StudyPage.module.css";

export default function StudyPage() {
  const params = useParams();
  const courseId = params.id;

  const [collapsed, setCollapsed] = useState(false);
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const modules = [
    {
      title: "Arrays",
      subtopics: [
        {
          name: "Traversal",
          content:
            "Traversal means visiting each element of the array sequentially using loops."
        },
        {
          name: "Prefix Sum",
          content:
            "Prefix Sum technique helps in solving range query problems efficiently."
        },
        {
          name: "Sliding Window",
          content:
            "Sliding Window technique is used to solve subarray problems optimally."
        }
      ]
    },
    {
      title: "Recursion",
      subtopics: [
        {
          name: "Basic Recursion",
          content:
            "Recursion is when a function calls itself to solve smaller subproblems."
        },
        {
          name: "Backtracking",
          content:
            "Backtracking is used to generate all possible solutions by exploring possibilities."
        }
      ]
    },
    {
      title: "Sorting",
      subtopics: [
        {
          name: "Merge Sort",
          content:
            "Merge Sort uses divide and conquer strategy to sort elements efficiently."
        },
        {
          name: "Quick Sort",
          content:
            "Quick Sort selects a pivot and partitions the array around it."
        }
      ]
    }
  ];

  const [activeSubtopic, setActiveSubtopic] = useState(
    modules[0].subtopics[0].name
  );

  const activeContent =
    modules
      .flatMap((m) => m.subtopics)
      .find((sub) => sub.name === activeSubtopic)?.content || "";

  const totalTopics = modules.reduce(
    (acc, module) => acc + module.subtopics.length,
    0
  );

  const progress = Math.round((completed.length / totalTopics) * 100);

  const toggleComplete = (topic: string) => {
    setCompleted((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  return (
    <motion.div
      className={`${styles.container} ${
        darkMode ? styles.dark : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <motion.div
        className={styles.sidebar}
        animate={{ x: collapsed ? -280 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(true)}
        >
          ✖
        </button>

        <h2>DSA Course</h2>

        {modules.map((module, index) => (
          <div key={index} className={styles.module}>
            <div
              className={styles.moduleTitle}
              onClick={() =>
                setOpenModule(
                  openModule === index ? null : index
                )
              }
            >
              {module.title}
              <span>{openModule === index ? "−" : "+"}</span>
            </div>

            {openModule === index && (
              <div className={styles.subtopics}>
                {module.subtopics.map((sub, i) => (
                  <div
                    key={i}
                    className={`${styles.subtopic} ${
                      activeSubtopic === sub.name
                        ? styles.activeSubtopic
                        : ""
                    }`}
                    onClick={() =>
                      setActiveSubtopic(sub.name)
                    }
                  >
                    {sub.name}
                    {completed.includes(sub.name) && (
                      <span>✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {collapsed && (
        <button
          className={styles.openBtn}
          onClick={() => setCollapsed(false)}
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.topBar}>
          <div>
            <span className={styles.activeTab}>
              Course
            </span>
            <span>Grades</span>
            <span>Competencies</span>
          </div>

          <div className={styles.rightControls}>
            <button
              className={styles.themeBtn}
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              {darkMode ? "Light" : "Dark"} Mode
            </button>

            <div className={styles.progressBox}>
              <span>{progress}% Completed</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          key={activeSubtopic}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.readingSection}
        >
          <h1>{activeSubtopic}</h1>
          <p>{activeContent}</p>

          <button
            className={styles.completeBtn}
            onClick={() =>
              toggleComplete(activeSubtopic)
            }
          >
            {completed.includes(activeSubtopic)
              ? "Mark as Incomplete"
              : "Mark as Completed"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
