"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/Assignment.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import SubmissionSection from "@/components/features/SubmissionSection";
import SubmissionDetails from "@/components/features/SubmissionDetails";
import EvaluationSection from "@/components/features/EvaluationSection";
import { assignmentService } from "@/services/assignment.services";
import type { AssignmentWithSubmissionResponse } from "@/models/assignment-submission.model";

interface DescriptionProps {
  description: string;
}

function LocalAssignmentDescription({ description }: DescriptionProps) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>Assignment Description</h3>
      <p style={{ color: '#475569', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}



export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = params?.id ? Number(params.id) : null;

  const [data, setData] = useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const fetchData = async () => {
    if (!assignmentId) return;
    try {
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

  // Submit assignment
  const handleSubmit = async (formData: FormData) => {
    if (!assignmentId) return;
    try {
      await assignmentService.submit(assignmentId, formData);
      await fetchData(); // डेटा रिफ्रेश करें
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) return <div className={styles.container}><p>Loading...</p></div>;
  if (!data || !data.assignment) return <div className={styles.container}><p>No assignment found</p></div>;

  const { assignment, submission, isSubmitted } = data;
  const status = submission?.status?.toUpperCase();

  return (
    <div className={styles.container}>
      {/* Header section */}
      <AssignmentHeader
        title={assignment.title || "Untitled Assignment"}
        deadline={new Date(assignment.deadline)}
        status={submission?.status || "Not Submitted"}
      />

      {/* Description section - Using local fixed component */}
      <LocalAssignmentDescription description={assignment.description || "No description provided."} />

      {/* Submission logic */}
      {!isSubmitted && (
        <SubmissionSection onSubmit={handleSubmit} />
      )}

      {isSubmitted && submission && (
        <div style={{ marginTop: '20px' }}>
          <SubmissionDetails submission={submission} />

          {/* Evaluate Button */}
          {status === "SUBMITTED" && (
            <div className={styles.evaluateWrapper}>
              <button
                className={styles.evaluateBtn}
                onClick={() => setShowEvaluation(true)}
              >
                Evaluate Assignment
              </button>
            </div>
          )}

          {/* Show Evaluation Section After Click */}
          {showEvaluation && (
            <EvaluationSection submission={submission} />
          )}
        </div>
      )}
    </div>
  );
}