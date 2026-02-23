"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/styles/Assignment.module.css';
import { studentService } from '@/services/student.services'; // ✅ API Service इंपोर्ट की
import toast from "react-hot-toast"; // ✅ टोस्ट नोटिफिकेशन के लिए
import {
  FileUp, Link as LinkIcon, Type, Clock,
  CheckCircle, AlertCircle, ChevronRight,
  FileText, Info, Calendar, Download, Save
} from 'lucide-react';

export default function AssignmentPage({ params }: { params: { id: string } }) {
  // --- States & Logic ---
  const [submissionType, setSubmissionType] = useState('file');
  const [status, setStatus] = useState('Not Submitted');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const [assignmentTitle, setAssignmentTitle] = useState(''); 
  const [textInput, setTextInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileObject, setFileObject] = useState<File | null>(null); // ✅ असली फाइल स्टोर करने के लिए
  const [savedAssignments, setSavedAssignments] = useState<any[]>([]);

  // मान लेते हैं कि यह डेटा अब API से आएगा, लेकिन अभी के लिए स्टेटिक है
  const assignment = {
    id: params?.id || "default_id", // ✅ URL से ID उठाएगा
    title: "Advanced React Patterns - Quiz App",
    course: "Mastering React 2026",
    description: "Build a quiz application using Context API and Custom Hooks. Focus on code modularity, state management, and reusable logic.",
    deadline: "2026-02-28T23:59:00",
    attachments: ["Project_Requirements.pdf", "Base_Boilerplate.zip"]
  };

  useEffect(() => {
    const data = localStorage.getItem('my_assignments');
    if (data) {
      setSavedAssignments(JSON.parse(data));
    }
  }, []);

  // --- API Submission Logic ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentTitle.trim()) return toast.error("कृपया असाइनमेंट का टाइटल लिखें!");

    let contentValue = "";
    if (submissionType === 'text') contentValue = textInput;
    else if (submissionType === 'link') contentValue = linkInput;
    else contentValue = fileName;

    if (!contentValue) return toast.error("Please provide content or a file!");

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting to server...");

    try {
      // 1. Swagger API के हिसाब से FormData तैयार करना
      // अगर आपकी API JSON लेती है तो साधारण ऑब्जेक्ट भेजें, अगर फाइल तो FormData
      const formData = new FormData();
      formData.append("title", assignmentTitle);
      formData.append("type", submissionType);
      if (fileObject) formData.append("file", fileObject);
      else formData.append("content", contentValue);

      // 2. Swagger Endpoint: POST /assignments/{id}/submit
      await studentService.submitAssignment(assignment.id, formData);

      // 3. UI और LocalStorage अपडेट
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
      setSavedAssignments(updatedList);
      localStorage.setItem('my_assignments', JSON.stringify(updatedList));
      
      setSubmittedAt(timeStr);
      setStatus(newSubmission.status);
      
      toast.success("Assignment Submitted Successfully! ✅", { id: toastId });

      // Reset Inputs
      setAssignmentTitle('');
      setTextInput('');
      setLinkInput('');
      setFileName('');
      setFileObject(null);

    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submission Failed!", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className={styles.leftCol}>
            <section className={styles.heroSection}>
              <div className={styles.badgeRow}>
                <span className={styles.assignmentTag} style={{ backgroundColor: '#FACC15', color: '#000' }}>Current Module</span>
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
                <h3>Instructions</h3>
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

            <div className={styles.showSection}>
              <h3 className={styles.sectionTitle}>Your Submissions ({savedAssignments.length})</h3>
              {savedAssignments.map((item) => (
                <div key={item.id} className={styles.savedCard} style={{ borderLeft: '4px solid #FACC15' }}>
                  <div className={styles.savedHeader}>
                    <FileText size={20} color="#FACC15" />
                    <strong className={styles.boldTitle}>{item.displayTitle}</strong>
                    <span className={styles.timeLabel}>{item.time}</span>
                  </div>
                  <div className={styles.statusDone}><CheckCircle size={14} color="#FACC15" /> {item.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.stickyContainer}>
              <div className={styles.deadlineCard}>
                <div className={styles.deadlineInfo}>
                  <Calendar size={20} color="#FACC15" />
                  <div>
                    <p>Due Date</p>
                    <strong>Feb 28, 2026 • 11:59 PM</strong>
                  </div>
                </div>
              </div>

              <div className={styles.submitCard}>
                <h3>New Submission</h3>
                <form onSubmit={handleFinalSubmit} className={styles.submissionForm}>
                  <div className={styles.inputGroup}>
                    <label>ASSIGNMENT TITLE</label>
                    <input
                      type="text"
                      placeholder="ENTER TITLE"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      className={styles.proInput}
                      style={{ borderBottom: '2px solid #FACC15' }}
                    />
                  </div>

                  <div className={styles.typeTabs}>
                    {['file', 'text', 'link'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSubmissionType(type)}
                        className={submissionType === type ? styles.activeTab : ''}
                        style={submissionType === type ? { backgroundColor: '#FACC15', color: '#000' } : {}}
                      >
                        <span>{type.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>

                  {submissionType === 'file' && (
                    <div className={styles.dropzone}>
                      <input 
                        type="file" 
                        className={styles.hiddenInput} 
                        id="fileInput" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFileName(file.name);
                            setFileObject(file);
                          }
                        }} 
                      />
                      <label htmlFor="fileInput" className={styles.dropLabel}>
                        <FileUp size={32} color="#FACC15" />
                        <p>{fileName || "Upload Assignment File"}</p>
                      </label>
                    </div>
                  )}

                  {submissionType === 'text' && (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Write your solution..."
                      className={styles.proTextArea}
                    />
                  )}

                  {submissionType === 'link' && (
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="GitHub Link"
                      className={styles.proInput}
                    />
                  )}

                  <button type="submit" disabled={isSubmitting} className={styles.primaryBtn} style={{ backgroundColor: '#FACC15', color: '#000' }}>
                    <Save size={18} /> {isSubmitting ? "Submitting..." : "SUBMIT & SAVE"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}