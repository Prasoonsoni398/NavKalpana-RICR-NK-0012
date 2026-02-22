"use client";

import { useState } from "react";
import styles from "@/styles/Assignment.module.css";
import AssignmentHeader from "@/components/features/AssignmentHeader";
import AssignmentDescription from "@/components/features/AssignmentDescription";
import SubmissionSection from "@/components/features/SubmissionSection";
import SubmissionDetails from "@/components/features/SubmissionDetails";
import EvaluationSection from "@/components/features/EvaluationSection";

export default function AssignmentPage() {
    const deadline = new Date("2026-02-28T23:59:00");

    const [submission, setSubmission] = useState<any>(null);

    const handleSubmit = (type: string, content: any) => {
        const submissionTime = new Date();
        const lateFlag = submissionTime > deadline;

        setSubmission({
            submissionType: type,
            content,
            submissionTime,
            lateFlag,
            status: lateFlag ? "Late Submitted" : "Submitted",
            marks: null,
            feedback: null,
        });
    };

    const evaluateDummy = () => {
        if (!submission) return;

        setSubmission({
            ...submission,
            marks: Math.floor(Math.random() * 6) + 5,
            feedback: "Well implemented. Minor improvements required.",
            status: "Evaluated",
        });
    };

    return (
        <div className={styles.container}>
            <AssignmentHeader
                title="Full Stack Authentication System"
                deadline={deadline}
                status={submission?.status || "Not Submitted"}
            />

            <AssignmentDescription />

            {!submission && <SubmissionSection onSubmit={handleSubmit} />}

            {submission && (
                <>
                    <SubmissionDetails submission={submission} />
                    {submission.status !== "Evaluated" && (
                        <button className={styles.evaluateBtn} onClick={evaluateDummy}>
                            Evaluate Assignment
                        </button>
                    )}
                    {submission.status === "Evaluated" && (
                        <EvaluationSection submission={submission} />
                    )}
                </>
            )}
        </div>
    );
}