"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/Assignment.module.css';
import {
  FileUp, Link as LinkIcon, Type, Clock,
  CheckCircle, AlertCircle, ChevronRight,
  FileText, Info, Calendar, Download, Save
} from 'lucide-react';

export default function AssignmentPage() {
  // --- States & Logic ---
  const [submissionType, setSubmissionType] = useState('file');
  const [status, setStatus] = useState('Not Submitted');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const [assignmentTitle, setAssignmentTitle] = useState(''); // New Title State
  const [textInput, setTextInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [savedAssignments, setSavedAssignments] = useState<any[]>([]);

  const assignment = {
    title: "Advanced React Patterns - Quiz App",
    course: "Mastering React 2026",
    description: "Build a quiz application using Context API and Custom Hooks. Focus on code modularity, state management, and reusable logic.",
    deadline: "2026-02-28T23:59:00",
    attachments: ["Project_Requirements.pdf", "Base_Boilerplate.zip"]
  };

  // 1. Load Data on Mount
  useEffect(() => {
    const data = localStorage.getItem('my_assignments');
    if (data) {
      setSavedAssignments(JSON.parse(data));
    }
  }, []);

  // 2. Combined Submit & Save Logic
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!assignmentTitle.trim()) return alert("कृपया असाइनमेंट का टाइटल लिखें!");

    let contentValue = "";
    if (submissionType === 'text') contentValue = textInput;
    else if (submissionType === 'link') contentValue = linkInput;
    else contentValue = fileName || "Uploaded_File.pdf";

    if (!contentValue.trim()) return alert("Please provide content or a file!");

    setIsSubmitting(true);

    // Simulation
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleString();

      const newSubmission = {
        id: Date.now(),
        displayTitle: assignmentTitle.toUpperCase(),
        originalTitle: assignment.title,
        type: submissionType,
        content: contentValue,
        time: timeStr,
        status: now > new Date(assignment.deadline) ? 'Late Submitted' : 'Submitted'
      };

      const updatedList = [newSubmission, ...savedAssignments];

      // Update states
      setSavedAssignments(updatedList);
      setSubmittedAt(timeStr);
      setStatus(newSubmission.status);
      localStorage.setItem('my_assignments', JSON.stringify(updatedList));

      // Reset Inputs
      setIsSubmitting(false);
      setAssignmentTitle('');
      setTextInput('');
      setLinkInput('');
      setFileName('');
      alert("Assignment Saved and Showed below! ✅");
    }, 1500);
  };

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.mainContent}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <span>Courses</span> <ChevronRight size={14} />
          <span>{assignment.course}</span> <ChevronRight size={14} />
          <span className={styles.activeStep}>Assignment Details</span>
        </nav>

        <div className={styles.assignmentLayout}>

          {/* LEFT COLUMN: Instructions & Saved List */}
          <div className={styles.leftCol}>
            <section className={styles.heroSection}>
              <div className={styles.badgeRow}>
                <span className={styles.assignmentTag}>Current Module</span>
                <div className={`${styles.statusPill} ${styles[status.replace(' ', '')]}`}>
                  {status}
                </div>
              </div>
              <h1>{assignment.title}</h1>
              <p className={styles.courseSubtitle}>{assignment.course}</p>
            </section>

            <section className={styles.card}>
              <div className={styles.sectionHeader}>
                <Info size={20} color="#FACC15" />
                <h3>Assignment Instructions</h3>
              </div>
              <p className={styles.descText}>{assignment.description}</p>

              <div className={styles.attachmentGrid}>
                {assignment.attachments.map((file, i) => (
                  <div key={i} className={styles.fileChip}>
                    <FileText size={16} />
                    <span>{file}</span>
                    <Download size={16} className={styles.downloadIcon} />
                  </div>
                ))}
              </div>
            </section>

            {/* SHOWING SAVED LIST */}
            <div className={styles.showSection}>
              <h3 className={styles.sectionTitle}>Your Submissions ({savedAssignments.length})</h3>
              {savedAssignments.length === 0 ? (
                <div className={styles.card}><p>No assignments saved yet.</p></div>
              ) : (
                savedAssignments.map((item) => (
                  <div key={item.id} className={styles.savedCard}>
                    <div className={styles.savedHeader}>
                      <FileText size={20} color="#FACC15" />
                      <strong className={styles.boldTitle}>{item.displayTitle}</strong>
                      <span className={styles.timeLabel}>{item.time}</span>
                    </div>
                    <p className={styles.savedContent}>
                      <span className={styles.typeTag}>
                        {(item.type || 'FILE').toUpperCase()}:  
                      </span>
                    </p>
                    <div className={styles.statusDone}><CheckCircle size={14} /> {item.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Submission Portal */}
          <div className={styles.rightCol}>
            <div className={styles.stickyContainer}>
              <div className={styles.deadlineCard}>
                <div className={styles.deadlineInfo}>
                  <Calendar size={20} />
                  <div>
                    <p>Due Date</p>
                    <strong>Feb 28, 2026 • 11:59 PM</strong>
                  </div>
                </div>
              </div>

              <div className={styles.submitCard}>
                <h3>New Submission</h3>

                <form onSubmit={handleFinalSubmit} className={styles.submissionForm}>
                  {/* Title Input */}
                  <div className={styles.inputGroup}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>ASSIGNMENT TITLE</label>
                    <input
                      type="text"
                      placeholder="ENTER TITLE (e.g. REACT PROJECT)"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      className={styles.proInput}
                      style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className={styles.typeTabs}>
                    {['file', 'text', 'link'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSubmissionType(type)}
                        className={submissionType === type ? styles.activeTab : ''}
                      >
                        <span>{type.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  {submissionType === 'file' && (
                    <div className={styles.dropzone}>
                      <input type="file" className={styles.hiddenInput} id="fileInput" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                      <label htmlFor="fileInput" className={styles.dropLabel}>
                        <FileUp size={32} />
                        <p>{fileName || "Upload Assignment File"}</p>
                        <span>Max size: 25MB (PDF, ZIP, DOCX)</span>
                      </label>
                    </div>
                  )}

                  {submissionType === 'text' && (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Write your solution notes..."
                      className={styles.proTextArea}
                    />
                  )}

                  {submissionType === 'link' && (
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="GitHub Repository URL"
                      className={styles.proInput}
                    />
                  )}

                  <button type="submit" disabled={isSubmitting} className={styles.primaryBtn}>
                    <Save size={18} /> {isSubmitting ? "Saving..." : "SUBMIT & SAVE"}
                  </button>
                </form>

                {submittedAt && (
                  <div className={styles.submissionMeta}>
                    <CheckCircle size={14} color="#10B981" />
                    <span>Last Submission: {submittedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}