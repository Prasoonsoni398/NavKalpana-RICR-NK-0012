// --------------------
// SUBMIT ASSIGNMENT
// --------------------

export interface SubmitAssignmentRequest {
  assignmentId: number;
  fileUrl?: string;
  textContent?: string;
  externalLink?: string;
}


export interface SubmitAssignmentResponse {
  message: string;
  submissionId: number;
}

export interface SubmissionData {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl?: string;
  textAnswer?: string;   
  externalLink?: string;
  submissionTime: Date;
  lateFlag: boolean;
  status: string;
  marks?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface AssignmentData {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------
// FINAL RESPONSE MODEL
// --------------------

export interface AssignmentWithSubmissionResponse {
  assignment: AssignmentData;
  submission: SubmissionData | null;
  isSubmitted: boolean;
}