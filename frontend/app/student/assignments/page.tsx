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
} from "lucide-react";
import styles from "@/styles/Assignment.module.css";
import { assignmentService } from "@/services/assignment.services";
import { fileUploadService } from "@/services/fileupload.services";
import type {
  AssignmentWithSubmissionResponse,
} from "@/models/assignment-submission.model";
import toast from "react-hot-toast";

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
      const res =
        await assignmentService.getAssignmentWithSubmission(
          assignmentId!
        );
      setData(res);
    } catch {
      toast.error("Failed to load assignment");
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

      const body = new FormData();
      if (fileUrl) body.append("fileUrl", fileUrl);
      if (formData.text)
        body.append("textAnswer", formData.text);
      if (formData.link)
        body.append("externalLink", formData.link);

      await assignmentService.submit(assignmentId, body);

      toast.success("Assignment submitted!");
      fetchAssignment();
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================
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
      {/* HEADER */}
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
        {/* LEFT SIDE */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2>Description</h2>
            <p>{assignment.description}</p>
          </div>

          {submission &&
            getStatusDisplay(submission.status) ===
              "EVALUATED" && (
              <div className={styles.evaluationCard}>
                <h3>Marks: {submission.marks ?? 0}</h3>
                {submission.feedback && (
                  <p>{submission.feedback}</p>
                )}
              </div>
            )}
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightColumn}>
          {!isSubmitted ? (
            <div className={styles.submissionCard}>
              <h2>Submit Assignment</h2>

              <div className={styles.typeSelector}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("file")
                  }
                >
                  <FileUp size={16} /> File
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("text")
                  }
                >
                  <Type size={16} /> Text
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType("link")
                  }
                >
                  <Link2 size={16} /> Link
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {selectedType === "file" && (
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        file:
                          e.target.files?.[0] || null,
                      })
                    }
                  />
                )}

                {selectedType === "text" && (
                  <textarea
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        text: e.target.value,
                      })
                    }
                  />
                )}

                {selectedType === "link" && (
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        link: e.target.value,
                      })
                    }
                  />
                )}

                <button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit"}
                  <Send size={14} />
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.submissionCard}>
              <h2>Your Submission</h2>

              {submission?.fileUrl && (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                  <ExternalLink size={14} />
                </a>
              )}

              {submission?.content && (
                <p>{submission.content}</p>
              )}

              <button
                onClick={() =>
                  router.push(
                    "/student/assignments"
                  )
                }
              >
                <ChevronRight size={14} />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}