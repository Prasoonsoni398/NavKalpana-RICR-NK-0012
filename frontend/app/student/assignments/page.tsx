"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Link as LinkIcon, MessageSquare, FileText, CheckCircle } from "lucide-react";
import { courseService } from "@/services/user.services";
import styles from "@/styles/Assignment.module.css";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  // Form States
  const [file, setFile] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch assignments on mount
  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await courseService.getAllAssignments();
        setAssignments(data || []);
      } catch (err) {
        console.error("Failed to fetch assignments");
      }
    };
    fetchList();
  }, []);

  const openSubmitModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    try {
      setSubmitting(true);
      let finalFileUrl = "";

      // 1. File Upload (using the fixed service function)
      if (file) {
        const uploadRes = await courseService.uploadFile(file);
        finalFileUrl = uploadRes.url || uploadRes.fileUrl; 
      }

      // 2. Payload Division (Exact Swagger Match)
      const submissionPayload = {
        fileUrl: finalFileUrl,
        textAnswer: textAnswer || "No description provided",
        externalLink: externalLink
      };

      // 3. API Call with Path ID
      await courseService.submitAssignment(selectedAssignment.id, submissionPayload);
      
      alert("असाइनमेंट सबमिट हो गया! ✅");
      setIsModalOpen(false);
      
      // Reset Form
      setFile(null);
      setExternalLink("");
      setTextAnswer("");
    } catch (error: any) {
      console.error("❌ Submission Error:", error.response?.data || error.message);
      alert("सबमिशन फेल! कंसोल चेक करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Assignments</h1>
        <p>Complete your tasks and track your progress</p>
      </header>

      <div className={styles.grid}>
        {/* Example Card - Mapping assignments logic should be here */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
             <div className={styles.iconBg}><FileText size={24} /></div>
             <span className={styles.statusBadge}>PENDING</span>
          </div>
          <h3>React Project Submission</h3>
          <p className={styles.courseName}>Frontend Development</p>
          <button 
            className={styles.submitBtn} 
            onClick={() => openSubmitModal({id: "1", title: "React Project"})}
          >
            <Upload size={16} /> Submit Now
          </button>
        </div>
      </div>

      {/* 🆕 MODAL SECTION */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Submit: {selectedAssignment?.title}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* File Input */}
              <div className={styles.inputGroup}>
                <label>Upload Assignment File</label>
                <div className={styles.fileDropZone}>
                  <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className={styles.fileInput} />
                  <div className={styles.dropZoneContent}>
                    <Upload size={24} color="var(--primary-hover)" />
                    <p>{file ? file.name : "Choose a file or drag here"}</p>
                  </div>
                </div>
              </div>

              {/* Text Answer */}
              <div className={styles.inputGroup}>
                <label>Short Description (textAnswer)</label>
                <div className={styles.linkInputWrapper}>
                  <MessageSquare size={18} />
                  <input 
                    type="text" 
                    placeholder="Write your notes here..." 
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                  />
                </div>
              </div>

              {/* External Link */}
              <div className={styles.inputGroup}>
                <label>Project Link (externalLink)</label>
                <div className={styles.linkInputWrapper}>
                  <LinkIcon size={18} />
                  <input 
                    type="url" 
                    placeholder="https://github.com/your-project" 
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.confirmBtn} disabled={submitting}>
                  {submitting ? "Submitting..." : "Confirm Submission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}