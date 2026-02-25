"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/AssignmentDetails.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import { assignmentService } from "@/services/assignment.services";
import { fileUploadService } from "@/services/fileupload.services";
import type { AssignmentWithSubmissionResponse } from "@/models/assignment-submission.model";

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] = useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Assignment + Submission
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

  // Submit Assignment
  const handleSubmit = async (formValues: { file?: File; textAnswer?: string; externalLink?: string }) => {
    if (!assignmentId) return;
    try {
      setSubmitting(true);

      let fileUrl: string | undefined;

      // Upload file first
      if (formValues.file) {
        const uploadRes = await fileUploadService.uploadFile(formValues.file);
        fileUrl = uploadRes?.url || uploadRes?.fileUrl;
      }

      // Prepare FormData
      const formData = new FormData();
      if (fileUrl) formData.append("fileUrl", fileUrl);
      if (formValues.textAnswer) formData.append("textAnswer", formValues.textAnswer);
      if (formValues.externalLink) formData.append("externalLink", formValues.externalLink);

      // Submit
      await assignmentService.submit(assignmentId, formData);

      // Refresh page data
      await fetchData();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) return <div className={styles.container}>Loading assignment details...</div>;
  if (!data || !data.assignment) return <div className={styles.container}>No assignment found.</div>;

  const { assignment, submission, isSubmitted } = data;

  return (
    <div className={styles.container}>
      {/* ================= HEADER ================= */}
      <AssignmentHeader
        title={assignment.title}
        deadline={new Date(assignment.deadline)}
        status={submission?.status ?? "NOT_SUBMITTED"}
      />

      {/* ================= DESCRIPTION ================= */}
      <div className={`${styles.card} ${styles.descriptionBox}`}>
        <h3>Assignment Description</h3>
        <p>{assignment.description}</p>
      </div>

      {/* ================= SUBMISSION FORM ================= */}
      {!isSubmitted && (
        <div className={styles.card}>
          <h2>Submit Assignment</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fileInput = (e.currentTarget.elements.namedItem("file") as HTMLInputElement)?.files?.[0];
              const textAnswer = (e.currentTarget.elements.namedItem("textAnswer") as HTMLTextAreaElement)?.value;
              const externalLink = (e.currentTarget.elements.namedItem("externalLink") as HTMLInputElement)?.value;

              if (!fileInput && !textAnswer && !externalLink) {
                alert("Please provide at least one submission type");
                return;
              }

              handleSubmit({ file: fileInput, textAnswer, externalLink });
            }}
          >
            {/* File Upload */}
            <div className={styles.formGroup}>
              <label>Upload File (PDF / ZIP)</label>
              <input type="file" name="file" className={styles.fileUpload} />
            </div>

            {/* Text Answer */}
            <div className={styles.formGroup}>
              <label>Text Answer</label>
              <textarea
                name="textAnswer"
                className={styles.textArea}
                placeholder="Write your solution here..."
              />
            </div>

            {/* External Link */}
            <div className={styles.formGroup}>
              <label>Project Link</label>
              <input
                name="externalLink"
                type="text"
                className={styles.inputField}
                placeholder="https://github.com/your-project"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </form>
        </div>
      )}

      {/* ================= SUBMISSION DETAILS ================= */}
      {isSubmitted && submission && (
        <div className={styles.card}>
          <h3>Your Submission</h3>
          {submission.status === "PENDING" && (
            <div className={styles.pendingBox}>⏳ Your submission is under review.</div>
          )}
          {submission.status === "EVALUATED" && (
            <div className={styles.evaluatedBox}>
              <h4>Evaluation Result</h4>
              <p>
                <strong>Marks:</strong> {submission.marks ?? 0}
              </p>
              <p>
                <strong>Feedback:</strong> {submission.feedback ?? "No feedback provided."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}