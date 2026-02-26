"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Link2,
  Type,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  MessageSquare,
  Upload,
  Send,
  Calendar,
  AlertTriangle,
  ChevronRight,
  FileUp,
  ExternalLink,
  Save
} from 'lucide-react';
import styles from '@/styles/Assignment.module.css';
import { assignmentService } from '@/services/assignment.services';
import { fileUploadService } from '@/services/fileupload.services';
import type { 
  AssignmentWithSubmissionResponse, 
  SubmissionData,
} from '@/models/assignment-submission.model';
import toast from 'react-hot-toast';

type SubmissionType = "file" | "text" | "link";

const getStatusDisplay = (
  status: string
): "NOT_SUBMITTED" | "SUBMITTED" | "LATE_SUBMITTED" | "EVALUATED" => {
  const statusMap: Record<
    string,
    "NOT_SUBMITTED" | "SUBMITTED" | "LATE_SUBMITTED" | "EVALUATED"
  > = {
    NOT_SUBMITTED: "NOT_SUBMITTED",
    SUBMITTED: "SUBMITTED",
    LATE_SUBMITTED: "LATE_SUBMITTED",
    EVALUATED: "EVALUATED",
    PENDING: "SUBMITTED",
    COMPLETED: "EVALUATED",
    GRADED: "EVALUATED",
  };
  return statusMap[status] || "NOT_SUBMITTED";
};

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] =
    useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] =
    useState<SubmissionType>("file");

  const [formData, setFormData] = useState({
    file: null as File | null,
    text: "",
    link: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    if (!assignmentId) return;
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await assignmentService.getAssignmentWithSubmission(assignmentId!);
      setData(response);
      
      // Pre-fill form if there's an existing submission
      if (response.submission) {
        setFormData({
          file: null,
          text: response.submission.content || '',
          link: response.submission.fileUrl || ''
        });
        if (response.submission.content) setSelectedType('text');
        if (response.submission.fileUrl) setSelectedType('link');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!assignmentId) return;

    if (selectedType === "file" && !formData.file) {
      toast.error("Please upload a file");
      return;
    }

    if (selectedType === "text" && !formData.text.trim()) {
      toast.error("Please write your answer");
      return;
    }

    if (selectedType === "link" && !formData.link.trim()) {
      toast.error("Please enter a link");
      return;
    }

    try {
      setSubmitting(true);
      let fileUrl = "";

      if (formData.file) {
        const upload =
          await fileUploadService.uploadFile(formData.file);
        fileUrl = upload?.url || upload?.fileUrl || "";
      }

      // Create FormData object for submission
      const formDataObj = new FormData();
      
      // Add file URL if available
      if (fileUrl) {
        formDataObj.append('fileUrl', fileUrl);
      }
      
      // Add text content if available
      if (formData.text) {
        formDataObj.append('textAnswer', formData.text);
      }
      
      // Add external link if available
      if (formData.link) {
        formDataObj.append('externalLink', formData.link);
      }

      // Submit using FormData
      await assignmentService.submit(assignmentId, formDataObj);

      toast.success('Assignment submitted successfully!', { id: toastId });
      await fetchAssignmentData(); // Refresh data
      setShowPreview(true); // Show success preview
      
      // Reset form after successful submission
      setFormData({
        file: null,
        text: '',
        link: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit assignment. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const displayStatus = getStatusDisplay(status);
    
    const statusConfig = {
      NOT_SUBMITTED: { label: 'Not Submitted', color: '#64748B', icon: <AlertCircle size={14} /> },
      SUBMITTED: { label: 'Submitted', color: '#3B82F6', icon: <CheckCircle size={14} /> },
      LATE_SUBMITTED: { label: 'Late Submitted', color: '#F59E0B', icon: <AlertTriangle size={14} /> },
      EVALUATED: { label: 'Evaluated', color: '#10B981', icon: <Award size={14} /> }
    };
    
    const config = statusConfig[displayStatus];
    
    return (
      <span className={styles.statusBadge} style={{ backgroundColor: `${config.color}15`, color: config.color }}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Helper function to safely format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (!data?.assignment) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Assignment Not Found</h2>
      </div>
    );
  }

  const { assignment, submission, isSubmitted } = data;

  // ================= UI =================
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>{assignment.title}</h1>

        {submission && (
          <span className={styles.statusBadge}>
            {getStatusDisplay(submission.status)}
          </span>
        )}
      </motion.div>

      <div className={styles.contentGrid}>
        {/* Left Column - Assignment Details */}
        <motion.div 
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.card}>
            <h2>Description</h2>
            <p>{assignment.description}</p>
          </div>

          {submission && getStatusDisplay(submission.status) === 'EVALUATED' && (
            <motion.div 
              className={styles.evaluationCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={styles.cardTitle}>Evaluation Result</h2>
              <div className={styles.evaluationContent}>
                <div className={styles.marksContainer}>
                  <span className={styles.marksLabel}>Marks Obtained</span>
                  <span className={styles.marksValue}>{submission.marks || 0} / 100</span>
                </div>
                {submission.feedback && (
                  <p>{submission.feedback}</p>
                )}
              </div>
            )}
        </div>

        {/* Right Column - Submission Form */}
        <motion.div 
          className={styles.rightColumn}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!isSubmitted ? (
            /* 📝 केस 1: जब छात्र को असाइनमेंट जमा करना है */
            <div className={styles.submissionCard}>
              <h2 className={styles.cardTitle}>Submit Assignment</h2>
              
              {/* Submission Type Selector */}
              <div className={styles.typeSelector}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("file")
                  }
                >
                  <FileUp size={18} />
                  File Upload
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("text")
                  }
                >
                  <Type size={18} />
                  Text Answer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("link")
                  }
                >
                  <Link2 size={18} />
                  External Link
                </button>
              </div>

              <div className={styles.cardBody}>
                <h3>{assignment.title}</h3>
                <p className={styles.courseName}>
                  {assignment.description}
                </p>

                {assignment.submission && (
                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <CheckCircle size={16} />
                      Marks:{" "}
                      {assignment.submission.marks ?? "Not Evaluated"}
                    </div>
                  )}

                  {submission.fileUrl && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>External Link</span>
                      <a 
                        href={submission.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {submission.fileUrl}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {getStatusDisplay(submission.status) !== 'EVALUATED' && (
                  <div className={styles.pendingMessage}>
                    <Clock size={16} />
                    <span>Your submission is pending evaluation. You'll receive feedback soon.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                >
                  <ChevronRight size={16} />
                  Back to Assignments
                </button>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
}