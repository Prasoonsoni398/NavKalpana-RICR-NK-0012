"use client";

import { useState } from "react";
import styles from "@/styles/AssignmentDetails.module.css";

interface SubmissionSectionProps {
  onSubmit: (type: string, data: { file?: File | null; text?: string; link?: string }) => void;
  submitting?: boolean;
}

export default function SubmissionSection({ onSubmit, submitting = false }: SubmissionSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    // Optional: reset form after submission
    setFile(null);
    setText("");
    setLink("");
  };

  return (
    <div className={styles.card}>
      <h2>Submit Assignment</h2>

      <form onSubmit={handleSubmit} className={styles.formWrapper} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* File Upload */}
        <div className={styles.formGroup}>
          <label htmlFor="file-upload">Upload File (PDF / ZIP)</label>
          <input
            id="file-upload"
            type="file"
            className={styles.inputField}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            disabled={submitting}
          />
        </div>

        {/* Text Input */}
        <div className={styles.formGroup}>
          <label htmlFor="text-answer">Text Answer</label>
          <textarea
            id="text-answer"
            className={styles.textArea}
            placeholder="Write your solution here..."
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* External Link */}
        <div className={styles.formGroup}>
          <label htmlFor="external-link">Project Link</label>
          <input
            id="external-link"
            type="text"
            className={styles.inputField}
            placeholder="https://github.com/your-project"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
}