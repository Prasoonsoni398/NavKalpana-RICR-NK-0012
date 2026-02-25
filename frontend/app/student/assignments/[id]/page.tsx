"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/AssignmentDetails.module.css";
import { assignmentService } from "@/services/assignment.services";
import { fileUploadService } from "@/services/fileupload.services";

// Define the AssignmentHeader component
const AssignmentHeader = ({ title, deadline, status }: { 
  title: string; 
  deadline: Date; 
  status: string;
}) => {
  const getStatusColor = () => {
    switch(status) {
      case "EVALUATED": return "#10b981";
      case "PENDING": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerTop}>
        <h1 className={styles.title}>{title}</h1>
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor() }}
        >
          {status.replace("_", " ")}
        </span>
      </div>
      <div className={styles.deadline}>
        📅 Deadline: {deadline.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

// Define the SubmissionSection component
const SubmissionSection = ({ onSubmit, submitting }: { 
  onSubmit: (type: string, formValues: any) => Promise<void>;
  submitting: boolean;
}) => {
  const [submissionType, setSubmissionType] = useState<"file" | "text" | "link">("file");
  const [formValues, setFormValues] = useState({
    file: null as File | null,
    text: "",
    link: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormValues({ ...formValues, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on submission type
    if (submissionType === "file" && !formValues.file) {
      alert("Please select a file to upload");
      return;
    }
    if (submissionType === "text" && !formValues.text.trim()) {
      alert("Please enter your text answer");
      return;
    }
    if (submissionType === "link" && !formValues.link.trim()) {
      alert("Please enter a link");
      return;
    }

    await onSubmit(submissionType, formValues);
  };

  return (
    <div className={styles.card}>
      <h3>Submit Your Assignment</h3>
      
      {/* Submission Type Selector */}
      <div className={styles.submissionTypeSelector}>
        <button
          type="button"
          className={`${styles.typeButton} ${submissionType === "file" ? styles.active : ""}`}
          onClick={() => setSubmissionType("file")}
        >
          📎 File Upload
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${submissionType === "text" ? styles.active : ""}`}
          onClick={() => setSubmissionType("text")}
        >
          📝 Text Answer
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${submissionType === "link" ? styles.active : ""}`}
          onClick={() => setSubmissionType("link")}
        >
          🔗 External Link
        </button>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className={styles.submissionForm}>
        {submissionType === "file" && (
          <div className={styles.formGroup}>
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={submitting}
            />
            <small>Supported formats: PDF, Word, Images (max 10MB)</small>
          </div>
        )}

        {submissionType === "text" && (
          <div className={styles.formGroup}>
            <label htmlFor="text">Your Answer</label>
            <textarea
              id="text"
              value={formValues.text}
              onChange={(e) => setFormValues({ ...formValues, text: e.target.value })}
              rows={6}
              placeholder="Type your answer here..."
              className={styles.textarea}
              disabled={submitting}
            />
          </div>
        )}

        {submissionType === "link" && (
          <div className={styles.formGroup}>
            <label htmlFor="link">External Link</label>
            <input
              type="url"
              id="link"
              value={formValues.link}
              onChange={(e) => setFormValues({ ...formValues, link: e.target.value })}
              placeholder="https://example.com/your-work"
              className={styles.input}
              disabled={submitting}
            />
            <small>Provide a link to your work (Google Doc, GitHub, etc.)</small>
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
};

// Define the SubmissionDetails component
const SubmissionDetails = ({ submission }: { submission: any }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.submissionDetails}>
      <h3>Your Submission</h3>
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <strong>Submitted on:</strong>
          <span>{formatDate(submission.submittedAt)}</span>
        </div>
        
        {submission.fileUrl && (
          <div className={styles.detailItem}>
            <strong>Submitted file:</strong>
            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
              View File 📎
            </a>
          </div>
        )}
        
        {submission.textAnswer && (
          <div className={styles.detailItem}>
            <strong>Your text answer:</strong>
            <p className={styles.textAnswer}>{submission.textAnswer}</p>
          </div>
        )}
        
        {submission.externalLink && (
          <div className={styles.detailItem}>
            <strong>External link:</strong>
            <a href={submission.externalLink} target="_blank" rel="noopener noreferrer">
              {submission.externalLink} 🔗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Data Fetcher
  const fetchData = async () => {
    if (!assignmentId) return;
    try {
      setLoading(true);
      const response = await assignmentService.getAssignmentWithSubmission(assignmentId);
      setData(response);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  // 2. Handler: Submission Logic
  const handleSubmit = async (type: string, formValues: any) => {
    if (!assignmentId) return;
    try {
      setSubmitting(true);
      let fileUrl = "";

      if (formValues.file) {
        const uploadRes = await fileUploadService.uploadFile(formValues.file);
        fileUrl = uploadRes?.url || uploadRes?.fileUrl;
      }

      const formData = new FormData();
      
      if (fileUrl) {
        formData.append("fileUrl", fileUrl);
      }
      if (formValues.text) {
        formData.append("textAnswer", formValues.text);
      }
      if (formValues.link) {
        formData.append("externalLink", formValues.link);
      }

      await assignmentService.submit(assignmentId, formData);

      alert("Assignment submitted successfully! 🎉");
      await fetchData(); 
    } catch (error) {
      alert("Submission failed. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handler: Revaluation Request
  const handleRevaluation = async (submissionId: number) => {
    if (!confirm("Are you sure you want to request a revaluation?")) return;
    
    try {
      await assignmentService.requestRevaluation(submissionId);
      alert("Revaluation request submitted successfully!");
      await fetchData();
    } catch (error) {
      alert("Failed to request revaluation. Please try again.");
      console.error("Revaluation error:", error);
    }
  };

  if (loading) return <div className={styles.loadingState}>Loading...</div>;
  if (!data?.assignment) return <div className={styles.loadingState}>Assignment not found.</div>;

  const { assignment, submission, isSubmitted } = data;

  return (
    <div className={styles.container}>
      {/* 1. Header: Title & Deadline */}
      <AssignmentHeader
        title={assignment.title}
        deadline={new Date(assignment.deadline)}
        status={submission?.status || "PENDING_SUBMISSION"}
      />

      {/* 2. Description Card */}
      <div className={styles.card}>
        <h3>Assignment Description</h3>
        <p>{assignment.description}</p>
      </div>

      {/* 3. Conditional Rendering: Form vs Details */}
      {!isSubmitted ? (
        <SubmissionSection onSubmit={handleSubmit} submitting={submitting} />
      ) : (
        <div className={styles.card}>
          <SubmissionDetails submission={submission} />

          {/* Teacher Review Status */}
          {submission.status === "PENDING" && (
            <div className={styles.pendingBox}>
              ⏳ Your work has been received and is currently under review by the instructor.
            </div>
          )}

          {/* Marks & Feedback (Evaluated State) */}
          {submission.status === "EVALUATED" && (
            <div className={styles.evaluatedBox}>
              <div className={styles.evaluatedHeader}>
                <h4>Evaluation Result</h4>
                {/* Revaluation Button */}
                <button
                  className={styles.revaluationBtn}
                  onClick={() => handleRevaluation(submission.id)}
                >
                  Request Revaluation
                </button>
              </div>

              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Marks:</strong> <span>{submission.marks ?? 0} / 100</span>
                </div>
                <div className={styles.resultItem}>
                  <strong>Feedback:</strong>
                  <p>{submission.feedback ?? "Good job! No specific feedback provided."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}