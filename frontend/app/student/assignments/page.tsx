"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Link2,
  Type,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  MessageSquare,
  Upload,
  Send,
  X,
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

type SubmissionType = 'file' | 'text' | 'link';

// Helper function to get status display
const getStatusDisplay = (status: string): 'NOT_SUBMITTED' | 'SUBMITTED' | 'LATE_SUBMITTED' | 'EVALUATED' => {
  const statusMap: Record<string, 'NOT_SUBMITTED' | 'SUBMITTED' | 'LATE_SUBMITTED' | 'EVALUATED'> = {
    'NOT_SUBMITTED': 'NOT_SUBMITTED',
    'SUBMITTED': 'SUBMITTED',
    'LATE_SUBMITTED': 'LATE_SUBMITTED',
    'EVALUATED': 'EVALUATED',
    'PENDING': 'SUBMITTED',
    'COMPLETED': 'EVALUATED',
    'GRADED': 'EVALUATED'
  };
  return statusMap[status] || 'NOT_SUBMITTED';
};

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] = useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<SubmissionType>('file');
  const [formData, setFormData] = useState({
    file: null as File | null,
    text: '',
    link: ''
  });
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isLate, setIsLate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch assignment data
  useEffect(() => {
    if (!assignmentId) return;
    fetchAssignmentData();
  }, [assignmentId]);

  // Countdown timer for deadline
  useEffect(() => {
    if (!data?.assignment) return;

    const timer = setInterval(() => {
      const now = new Date();
      const deadline = new Date(data.assignment.deadline);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Deadline passed');
        setIsLate(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h remaining`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m remaining`);
        } else {
          setTimeRemaining(`${minutes}m remaining`);
        }
        setIsLate(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.assignment]);

  const fetchAssignmentData = async () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId || !data?.assignment) return;

    // Validate based on submission type
    if (selectedType === 'file' && !formData.file && !data?.submission?.fileUrl) {
      toast.error('Please select a file to upload');
      return;
    }
    if (selectedType === 'text' && !formData.text.trim()) {
      toast.error('Please enter your answer');
      return;
    }
    if (selectedType === 'link' && !formData.link.trim()) {
      toast.error('Please enter a link');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting assignment...');

    try {
      let fileUrl = data?.submission?.fileUrl || '';

      // Upload file if new file is selected
      if (formData.file) {
        const uploadRes = await fileUploadService.uploadFile(formData.file);
        fileUrl = uploadRes?.url || uploadRes?.fileUrl || '';
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
        <div className={styles.loadingSpinner} />
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (!data?.assignment) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <h2>Assignment Not Found</h2>
        <p>The assignment you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  const { assignment, submission, isSubmitted } = data;
  const deadline = new Date(assignment.deadline);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{assignment.title}</h1>
          <div className={styles.metaInfo}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              Deadline: {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString()}
            </span>
            <span className={styles.metaItem}>
              <Clock size={16} />
              {timeRemaining}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          {submission && getStatusBadge(submission.status)}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column - Assignment Details */}
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Assignment Description</h2>
            <p className={styles.description}>{assignment.description}</p>
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
                  <div className={styles.feedbackContainer}>
                    <span className={styles.feedbackLabel}>
                      <MessageSquare size={16} />
                      Feedback
                    </span>
                    <p className={styles.feedbackText}>{submission.feedback}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

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
                  className={`${styles.typeButton} ${selectedType === 'file' ? styles.active : ''}`}
                  onClick={() => setSelectedType('file')}
                >
                  <FileUp size={18} /> File Upload
                </button>
                <button
                  className={`${styles.typeButton} ${selectedType === 'text' ? styles.active : ''}`}
                  onClick={() => setSelectedType('text')}
                >
                  <Type size={18} /> Text Answer
                </button>
                <button
                  className={`${styles.typeButton} ${selectedType === 'link' ? styles.active : ''}`}
                  onClick={() => setSelectedType('link')}
                >
                  <Link2 size={18} /> External Link
                </button>
              </div>

              <div className={styles.cardBody}>
                <h3>{assignment.title}</h3>
                <p className={styles.courseName}>{assignment.description}</p>

                {/* 💡 यहाँ आपका Submit Button और Input Fields आएँगे */}
                <div className={styles.formPlaceholder}>
                  {/* selectedType के हिसाब से इनपुट दिखाएँ */}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.submissionCard}>
              <h2 className={styles.cardTitle}>Submission Details</h2>

              <div className={styles.cardBody}>
                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <CheckCircle size={16} color="#22c55e" />
                      <strong>Marks:</strong> {submission.marks ?? "Not Evaluated"}
                    </div>
                  </div>
                

                {submission?.fileUrl && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Your Submission:</span>
                    <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      View Link <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {submission?.status !== 'EVALUATED' && (
                  <div className={styles.pendingMessage}>
                    <Clock size={16} />
                    <span>Pending evaluation. You'll receive feedback soon.</span>
                  </div>
                )}

                <button
                  onClick={() => router.push('/student/assignments')}
                  className={styles.backToAssignments}
                >
                  <ChevronRight size={16} /> Back to Assignments
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}