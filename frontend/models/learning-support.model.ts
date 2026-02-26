export interface DoubtDetail {
  id: number;
  courseId: number;
  topic: string;
  description: string;
  fileUrl?: string | null;

  studentId: number;
  studentName: string;

  status: 'PENDING' | 'ANSWERED' | 'RESOLVED';

  createdAt: string;
  updatedAt: string;
}

export interface CreateDoubtRequest {
  courseId: number;
  topic: string;
  description: string;
  fileUrl?: string;
}
export interface BackupRequestDetail {
  id: number;
  courseId: number;
  topic: string;
  description: string;

  studentId: number;
  studentName: string;

  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  createdAt: string;
  updatedAt: string;
}
export interface CreateBackupRequest {
  courseId: number;
  topic: string;
  description: string;
}