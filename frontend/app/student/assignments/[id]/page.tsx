"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/Assignment.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import AssignmentDescription from "@/components/features/AssignmentDescription";
import SubmissionSection from "@/components/features/SubmissionSection";
import SubmissionDetails from "@/components/features/SubmissionDetails";
import EvaluationSection from "@/components/features/EvaluationSection";
import { assignmentService } from "@/services/assignment.services";
import type {
  AssignmentWithSubmissionResponse,
} from "@/models/assignment-submission.model";

export default function AssignmentPage() {
  const params = useParams();
  const assignmentId = Number(params.id);

  const [data, setData] =
    useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  // Fetch assignment
  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      try {
        const response =
          await assignmentService.getAssignmentWithSubmission(
            assignmentId
          );
        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  // Submit assignment
  const handleSubmit = async (formData: FormData) => {
    try {
      await assignmentService.submit(assignmentId, formData);

      const updated =
        await assignmentService.getAssignmentWithSubmission(
          assignmentId
        );

      setData(updated);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No assignment found</p>;

  const { assignment, submission, isSubmitted } = data;
  const status = submission?.status?.toUpperCase();

  return (
    <div className={styles.container}>
      <AssignmentHeader
        title={assignment.title}
        deadline={new Date(assignment.deadline)}
        status={submission?.status || "Not Submitted"}
      />

      <AssignmentDescription description={assignment.description} />

      {!isSubmitted && (
        <SubmissionSection onSubmit={handleSubmit} />
      )}

      {isSubmitted && submission && (
        <>
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
        </>
      )}
    </div>
  );
}