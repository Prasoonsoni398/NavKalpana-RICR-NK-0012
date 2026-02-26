/* -------------------------------
   Submission Data Interface
-------------------------------- */
export interface SubmissionData {
  id: number;
  content: string;
  fileUrl?: string;
  marks?: number;
  feedback?: string;
  status: "PENDING" | "SUBMITTED" | "EVALUATED";
  submittedAt: string; 
  submissionTime?: string;
  lateFlag?: boolean;
}

/* -------------------------------
   Assignment With Submission
-------------------------------- */
export interface AssignmentWithSubmissionResponse {
  assignment: {
    id: number;
    title: string;
    description: string;
    deadline: string;
  };
  submission?: SubmissionData;
  isSubmitted?: SubmissionData;
}