"use client";

import { useState } from "react";
import styles from "@/styles/Assignment.module.css";

export default function SubmissionSection({ onSubmit }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!file && !text && !link) {
      alert("Please provide at least one submission type");
      return;
    }

    const submissionData = {
      file,
      text,
      link,
    };

    onSubmit("Mixed", submissionData);
  };

  return (
    <div className={styles.card}>
      <h2>Submit Assignment</h2>

      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        
        {/* File Upload */}
        <div className={styles.inputGroup}>
          <label>Upload File (PDF / ZIP)</label>
          <input
            type="file"
            className={styles.formInput}
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {/* Text Input */}
        <div className={styles.inputGroup}>
          <label>Text Answer</label>
          <textarea
            className={styles.formInput}
            placeholder="Write your solution here..."
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* External Link */}
        <div className={styles.inputGroup}>
          <label>Project Link</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="https://github.com/your-project"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.primaryBtn}>
          Submit Assignment
        </button>
      </form>
    </div>
  );
}       