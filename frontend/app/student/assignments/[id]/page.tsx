"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";  // ✅ ADD THIS
import styles from "@/styles/Assignment.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import AssignmentDescription from "@/components/features/AssignmentDescription";
import SubmissionSection from "@/components/features/SubmissionSection";
import SubmissionDetails from "@/components/features/SubmissionDetails";
import EvaluationSection from "@/components/features/EvaluationSection";
import { assignmentService } from "@/services/assignment.services";
import type {
  AssignmentWithSubmissionResponse,
  SubmissionData,
} from "@/models/assignment-submission.model";

export default function AssignmentPage() {

  const params = useParams();   // ✅ GET PARAMS HERE
  const assignmentId = Number(params.id);

  const [data, setData] =
    useState<AssignmentWithSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
          {submission.status === "EVALUATED" && (
            <EvaluationSection submission={submission} />
          )}
        </>
      )}
    </div>
  );
}