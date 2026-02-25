"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/AssignmentDetails.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import SubmissionSection from "@/components/features/SubmissionSection";
import SubmissionDetails from "@/components/features/SubmissionDetails";
import { assignmentService } from "@/services/assignment.services";
import { fileUploadService } from "@/services/fileupload.services";
import type {
  AssignmentWithSubmissionResponse,
} from "@/models/assignment-submission.model";

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] =
    useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!assignmentId) return;

    try {
      setLoading(true);
      const response =
        await assignmentService.getAssignmentWithSubmission(
          assignmentId
        );
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

  const handleSubmit = async (formValues: {
    file?: File;
    textAnswer?: string;
    externalLink?: string;
  }) => {
    if (!assignmentId) return;

    try {
      setSubmitting(true);

      let fileUrl: string | undefined;

      // Upload file first
      if (formValues.file) {
        const uploadRes = await fileUploadService.uploadFile(
          formValues.file
        );
        fileUrl = uploadRes?.url || uploadRes?.fileUrl;
      }

      //  Prepare FormData
      const formData = new FormData();
      if (fileUrl) formData.append("fileUrl", fileUrl);
      if (formValues.textAnswer)
        formData.append("textAnswer", formValues.textAnswer);
      if (formValues.externalLink)
        formData.append("externalLink", formValues.externalLink);

      // Submit
      await assignmentService.submit(assignmentId, formData);

      //  Refresh page data
      await fetchData();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          Loading assignment details...
        </div>
      </div>
    );
  }

  if (!data || !data.assignment) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          No assignment found.
        </div>
      </div>
    );
  }

  const { assignment, submission, isSubmitted } = data;

  return (
    <div className={styles.container}>
      
      {/* ================= HEADER ================= */}
      <AssignmentHeader
        title={assignment.title}
        deadline={new Date(assignment.deadline)}
        status={
          submission?.status
            ? submission.status
            : "NOT_SUBMITTED"
        }
      />

      {/* ================= DESCRIPTION CARD ================= */}
      <div className={`${styles.card} ${styles.descriptionBox}`}>
        <h3>Assignment Description</h3>
        <p>{assignment.description}</p>
      </div>

      {/* ================= SUBMISSION SECTION ================= */}

      {!isSubmitted && (
        <div className={styles.card}>
          <SubmissionSection
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      )}

      {isSubmitted && submission && (
        <div className={styles.card}>

          {/* Submitted Details */}
          <SubmissionDetails submission={submission} />

          {/* Pending */}
          {submission.status === "PENDING" && (
            <div className={styles.pendingBox}>
              ⏳ Your submission is under review.
            </div>
          )}

          {/* Evaluated */}
          {submission.status === "EVALUATED" && (
            <div className={styles.evaluatedBox}>
              <h4>Evaluation Result</h4>

              <p>
                <strong>Marks:</strong>{" "}
                {submission.marks ?? 0}
              </p>

              <p>
                <strong>Feedback:</strong>{" "}
                {submission.feedback ?? "No feedback provided."}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}